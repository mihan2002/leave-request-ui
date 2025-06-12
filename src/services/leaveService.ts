
import api from './http';

export const getLeaves = async () => {
  const res = await api.get('api/leave-requests');
  return res.data;
};

export const createLeave = async (leaveData: {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}) => {
  const res = await api.post('api/leave-requests', leaveData);
  return res.data;
};

export const updateLeave = async (id: number, leaveData: {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}) => {
  const res = await api.put(`api/leave-requests/${id}`, leaveData);
  return res.data;
};

export const deleteLeave = async (id: number) => {
  const res = await api.delete(`api/leave-requests/${id}`);
  return res.data;
};
