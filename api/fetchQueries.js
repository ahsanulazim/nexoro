import api from "@/axios/axiosInstance";

/**
 * Fetch queries with search, filter, sort, and pagination
 */
export const fetchQueries = async (params = {}, options = {}) => {
  const res = await api.get("/queries", {
    params,
    signal: options?.signal,
  });
  return res.data;
};

/**
 * Fetch a single query by its ID
 */
export const fetchQueryById = async (id) => {
  const res = await api.get(`/queries/${id}`);
  return res.data;
};

/**
 * Update the status of a query ("unread", "read", "contacted", "resolved")
 */
export const updateQueryStatus = async (id, status) => {
  const res = await api.patch(`/queries/${id}/status`, { status });
  return res.data;
};

/**
 * Toggle starred/favorite status of a query
 */
export const toggleStarQuery = async (id) => {
  const res = await api.patch(`/queries/${id}/star`);
  return res.data;
};

/**
 * Add an internal note to a query
 */
export const addQueryNote = async (id, text) => {
  const res = await api.post(`/queries/${id}/notes`, { text });
  return res.data;
};

/**
 * Delete an internal note from a query
 */
export const deleteQueryNote = async (id, noteId) => {
  const res = await api.delete(`/queries/${id}/notes/${noteId}`);
  return res.data;
};

/**
 * Delete a query
 */
export const deleteQuery = async (id) => {
  const res = await api.delete(`/queries/${id}`);
  return res.data;
};

/**
 * Batch update queries (mark_read, mark_resolved, delete)
 */
export const batchUpdateQueries = async (ids, action) => {
  const res = await api.post("/queries/batch", { ids, action });
  return res.data;
};
