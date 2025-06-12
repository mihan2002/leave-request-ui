import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Stack,
  Box,
} from "@mui/material";
import { leaveBus } from "../utils/rxBus";
import LeaveForm from "./LeaveForm";
import { logout } from "../services/authService";
import { getLeaves, deleteLeave, getAllLeaves } from "../services/leaveService";
import Swal from "sweetalert2";

type Leave = {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  user?: { username: string }; // Optional for role-based rendering
};

export default function LeaveList() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const fetchLeaves = async () => {
    try {
      const res = role === "USER" ? await getLeaves() : await getAllLeaves();
      setLeaves(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
      setLeaves([]);
    }
  };

  useEffect(() => {
    fetchLeaves();
    const sub = leaveBus.subscribe((event) => {
      if (event === "refresh-leave-list") {
        fetchLeaves();
        setShowForm(false);
        setEditingLeave(null);
      }
    });
    return () => sub.unsubscribe();
  }, []);

  const handleNew = () => {
    setEditingLeave(null);
    setShowForm(true);
  };

  const handleUpdate = (leave: Leave) => {
    setEditingLeave(leave);
    setShowForm(true);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Confirm Logout",
      text: "You are about to log out of your account. Do you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
        Swal.fire("Logged out", "You have been successfully logged out.", "success");
      }
    });
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Leave Request?",
      text: "This action cannot be undone. Do you really want to delete this leave request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteLeave(id);
      fetchLeaves();
      Swal.fire("Deleted!", "The leave request has been deleted.", "success");
    } catch (err) {
      console.error("Failed to delete leave request:", err);
      Swal.fire("Error", "There was a problem deleting the leave request.", "error");
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f4f6f8", minHeight: "100vh", py: 5 }}>
      <Paper
        sx={{
          maxWidth: "90%",
          mx: "auto",
          p: 4,
          backgroundColor: "#e8ebed",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        {/* Header Actions */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" fontWeight="bold">
            Leave Requests
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="success" onClick={handleNew}>
              + New Leave
            </Button>
            <Button variant="contained" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Stack>

        {/* Leave Table or Empty Message */}
        {leaves.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No leave requests found.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ backgroundColor: "#f0f2f5" }}>
            <Table>
              <TableHead>
                <TableRow>
                  {role === "ADMIN" && <TableCell>User</TableCell>}
                  <TableCell>Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaves.map((leave) => (
                  <TableRow key={leave.id}>
                    {role === "ADMIN" && (
                      <TableCell>{leave.user?.username || "N/A"}</TableCell>
                    )}
                    <TableCell>{leave.type}</TableCell>
                    <TableCell>{leave.startDate}</TableCell>
                    <TableCell>{leave.endDate}</TableCell>
                    <TableCell>{leave.reason}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          variant="contained"
                          color="warning"
                          size="small"
                          onClick={() => handleUpdate(leave)}
                        >
                          Update
                        </Button>
                        {role === "ADMIN" && (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(leave.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Dialog for Form */}
        <Dialog
          open={showForm}
          onClose={() => setShowForm(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent>
            <LeaveForm editingLeave={editingLeave} />
          </DialogContent>
        </Dialog>
      </Paper>
    </Box>
  );
}
