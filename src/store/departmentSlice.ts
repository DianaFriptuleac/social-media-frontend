import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DepartmentUIState {
    selectedDepartmentId: string | null;
    page: number;
    pageSize: number;
}

const initialState: DepartmentUIState = {
    selectedDepartmentId: null,
    page: 1,
    pageSize: 10,

}
const departmentSlice = createSlice({
    name: 'departmentUI',
    initialState,
    reducers: {
        setSelectedDepartment(state, action: PayloadAction<string | null>) {
            state.selectedDepartmentId = action.payload;
            state.page = 1; // reset pag. quando caambio department

        },
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
        setPageSize(state, action: PayloadAction<number>) {
            state.pageSize = action.payload;
            state.page = 1;
        }
    }
});
export const { setSelectedDepartment, setPage, setPageSize } = departmentSlice.actions;
export default departmentSlice.reducer;
