import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Alert,
  Paper,
  FormHelperText,
} from "@mui/material";
import { createLeave, updateLeave } from "../services/leaveService";
import { leaveBus } from "../utils/rxBus";

type Props = {
  editingLeave?: {
    id: number;
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
  } | null;
};

const leaveTypes = [
  "Sick Leave",
  "Casual Leave",
  "Earned Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Compensatory Leave",
  "Bereavement Leave",
  "Unpaid Leave",
];

const LeaveForm: React.FC<Props> = ({ editingLeave }) => {
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const [typeError, setTypeError] = useState(false);
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);
  const [reasonError, setReasonError] = useState(false);

  useEffect(() => {
    if (editingLeave) {
      setType(editingLeave.type);
      setStartDate(editingLeave.startDate);
      setEndDate(editingLeave.endDate);
      setReason(editingLeave.reason);
    }
  }, [editingLeave]);

  const validateFields = () => {
    let valid = true;
    setTypeError(false);
    setStartDateError(false);
    setEndDateError(false);
    setReasonError(false);

    if (!type) {
      setTypeError(true);
      valid = false;
    }
    if (!startDate) {
      setStartDateError(true);
      valid = false;
    }
    if (!endDate) {
      setEndDateError(true);
      valid = false;
    }
    if (!reason.trim()) {
      setReasonError(true);
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateFields()) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      if (editingLeave) {
        await updateLeave(editingLeave.id, {
          type,
          startDate,
          endDate,
          reason,
        });
      } else {
        await createLeave({ type, startDate, endDate, reason });
      }
      leaveBus.next("refresh-leave-list");
    } catch (err) {
      setError("Failed to submit leave request.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        {editingLeave ? "Update Leave" : "Request Leave"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <FormControl fullWidth margin="normal" error={typeError}>
          <InputLabel id="leave-type-label" required>
            Leave Type
          </InputLabel>
          <Select
            labelId="leave-type-label"
            id="type"
            value={type}
            label="Leave Type *"
            onChange={(e) => setType(e.target.value)}
          >
            {leaveTypes.map((lt) => (
              <MenuItem key={lt} value={lt}>
                {lt}
              </MenuItem>
            ))}
          </Select>
          {typeError && <FormHelperText>Leave type is required</FormHelperText>}
        </FormControl>

        <TextField
          label="Start Date"
          type="date"
          required
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, required: true }}
          value={startDate}
          error={startDateError}
          helperText={startDateError ? "Start date is required" : ""}
          onChange={(e) => {
            const selectedDate = e.target.value;
            setStartDate(selectedDate);
            if (endDate && selectedDate > endDate) {
              setEndDate("");
            }
          }}
        />

        <TextField
          label="End Date"
          type="date"
          required
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, required: true }}
          value={endDate}
          error={endDateError}
          helperText={endDateError ? "End date is required" : ""}
          inputProps={{
            min: startDate,
          }}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <TextField
          label="Reason"
          multiline
          rows={4}
          required
          fullWidth
          margin="normal"
          value={reason}
          error={reasonError}
          helperText={reasonError ? "Reason is required" : ""}
          onChange={(e) => setReason(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          {editingLeave ? "Update" : "Submit"}
        </Button>
      </Box>
    </Paper>
  );
};

export default LeaveForm;
