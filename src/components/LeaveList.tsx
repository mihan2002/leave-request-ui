import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
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
import { getLeaves, deleteLeave } from "../services/leaveService";

type Leave = {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
};

export default function LeaveList() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);
  const navigate = useNavigate();

  const fetchLeaves = async () => {
    try {
      const res = await getLeaves();
      if (Array.isArray(res)) {
        setLeaves(res);
      } else {
        console.warn("Unexpected response format:", res);
        setLeaves([]);
      }
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

  const handleUpdate = (leave: Leave) => {
    setEditingLeave(leave);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingLeave(null);
    setShowForm(true);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      logout();
      navigate("/login");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this leave request?");
    if (!confirmDelete) return;

    try {
      await deleteLeave(id);
      fetchLeaves();
    } catch (err) {
      console.error("Failed to delete leave request:", err);
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
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
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

        {leaves.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No leave requests found.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ backgroundColor: "#f0f2f5" }}>
            <Table>
              <TableHead>
                <TableRow>
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
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(leave.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={showForm} onClose={() => setShowForm(false)} fullWidth maxWidth="sm">
          <DialogTitle>{editingLeave ? "Update Leave" : "Request Leave"}</DialogTitle>
          <DialogContent>
            <LeaveForm editingLeave={editingLeave} />
          </DialogContent>
        </Dialog>
      </Paper>
    </Box>
  );
}
