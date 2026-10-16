import { Pencil, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { USER_ROLE_LABELS, USER_ROLES } from "@/enums";
import { formatDate } from "@/lib";
import type { Id, User } from "@/types";

interface UsersTableProps {
  users: readonly User[];
  /** The signed-in admin, who can't delete their own account */
  currentUserId: Id;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

// Name and email share a cell so the table fits phones; "Joined" shows from tablet width.
// Admin accounts have no actions: the API never edits or deletes them.
export function UsersTable({ users, currentUserId, onEdit, onDelete }: UsersTableProps) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden sm:table-cell">Joined</TableHead>
            <TableHead className="pr-4 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isAdmin = user.role === USER_ROLES.ADMIN;
            const isSelf = user._id === currentUserId;
            return (
              <TableRow key={user._id}>
                <TableCell className="max-w-0 pl-4">
                  <div className="truncate font-medium">
                    {user.name}
                    {isSelf && <span className="font-normal text-muted-foreground"> (you)</span>}
                  </div>
                  <div className="truncate text-muted-foreground">{user.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={isAdmin ? "default" : "secondary"}>
                    {USER_ROLE_LABELS[user.role]}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell className="pr-4 text-right whitespace-nowrap">
                  {!isAdmin && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(user)}
                        aria-label={`Edit ${user.name}`}
                      >
                        <Pencil aria-hidden />
                      </Button>
                      {!isSelf && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onDelete(user)}
                          aria-label={`Delete ${user.name}`}
                        >
                          <Trash2 aria-hidden />
                        </Button>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
