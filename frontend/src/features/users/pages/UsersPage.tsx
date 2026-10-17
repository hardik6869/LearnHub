import { Plus, UsersRound } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import {
  ConfirmDialog,
  DataPagination,
  EmptyState,
  ErrorState,
  FilterSelect,
  FormDialog,
  LoadingState,
  PageHeader,
  SearchInput,
} from "@/components/common";
import { Button } from "@/components/ui";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { USER_ROLE_LABELS, USER_ROLES } from "@/enums";
import { useCurrentUser } from "@/features/auth";
import { useDocumentTitle } from "@/hooks";
import type { SelectOption, User } from "@/types";
import { UserForm } from "../components/UserForm";
import { UsersTable } from "../components/UsersTable";
import { useCreateUser, useDeleteUser, useUpdateUser } from "../hooks/useUserMutations";
import { useUsers } from "../hooks/useUsers";
import { toUserFormValues, type UserFormValues } from "../schemas/userSchema";

const ROLE_OPTIONS: readonly SelectOption[] = Object.values(USER_ROLES).map((role) => ({
  value: role,
  label: USER_ROLE_LABELS[role],
}));

// "new" opens the create dialog; a user opens the edit dialog
type Editing = User | "new" | null;

// Admin only (behind RequireAuth roles={ADMIN_ROLES}), inside the dashboard layout. Search, role
// and page live in the URL.
export function UsersPage() {
  useDocumentTitle("Users");
  const { user: currentUser } = useCurrentUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const role = searchParams.get("role") ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const { data, isPending, isError, isPlaceholderData, refetch } = useUsers({
    page,
    limit: DEFAULT_PAGE_SIZE,
    sort: "name",
    search: search || undefined,
    role: role || undefined,
  });
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const isNew = editing === "new";
  const editingUser = editing === "new" || editing === null ? undefined : editing;

  // Any change but the page starts again from page 1
  const setParam = (key: "search" | "role" | "page", value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== "page") next.delete("page");
      return next;
    });
  };

  const handleSubmit = ({ password, ...details }: UserFormValues) => {
    const close = { onSuccess: () => setEditing(null) };
    if (isNew) createUser.mutate({ ...details, password }, close);
    else if (editingUser) updateUser.mutate({ id: editingUser._id, payload: details }, close);
  };

  const confirmDelete = () => {
    if (deleting) deleteUser.mutate(deleting._id, { onSuccess: () => setDeleting(null) });
  };

  const renderResults = () => {
    if (isPending) return <LoadingState variant="list" count={5} label="Loading users…" />;
    if (isError) return <ErrorState onRetry={() => void refetch()} />;
    if (data.data.length === 0) {
      return (
        <EmptyState
          icon={UsersRound}
          title="No users found"
          description="Try a different name or role."
        />
      );
    }
    return (
      <div
        className="space-y-6 transition-opacity aria-busy:opacity-60"
        aria-busy={isPlaceholderData}
      >
        <UsersTable
          users={data.data}
          currentUserId={currentUser?._id ?? ""}
          onEdit={setEditing}
          onDelete={setDeleting}
        />
        <DataPagination
          pagination={data.pagination}
          page={page}
          onPageChange={(next) => setParam("page", String(next))}
          disabled={isPlaceholderData}
        />
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title="Users"
        description="Manage student and publisher accounts."
        actions={
          <Button onClick={() => setEditing("new")}>
            <Plus aria-hidden />
            Add user
          </Button>
        }
      />

      <search className="flex flex-col gap-2 sm:flex-row">
        <SearchInput
          id="user-search"
          label="Search users by name"
          value={search}
          onSearch={(value) => setParam("search", value)}
          className="flex-1"
        />
        <FilterSelect
          label="Role"
          unsetLabel="All roles"
          value={role}
          options={ROLE_OPTIONS}
          onChange={(value) => setParam("role", value)}
        />
      </search>

      {renderResults()}

      <FormDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title={isNew ? "Add user" : "Edit user"}
        description={editingUser?.email}
      >
        <UserForm
          isNew={isNew}
          defaultValues={toUserFormValues(editingUser)}
          onSubmit={handleSubmit}
          isPending={createUser.isPending || updateUser.isPending}
        />
      </FormDialog>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete ${deleting?.name ?? "user"}?`}
        description="They will no longer be able to log in. This can't be undone."
        confirmLabel="Delete user"
        destructive
        isPending={deleteUser.isPending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
