import { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, IconButton, Stack, Button
} from '@mui/material';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';

import { userApi, forestApi, landOwnerApi } from 'api/route';
import { isAdmin } from '../../../utils/authUtils';

import { UserForm, ForestForm, LandOwnerForm } from './FormInput';

// --- 1. USER TABLE ---
export function UserTable() {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null); // null = Create mode, Object = Edit mode

    const isUserAdmin = isAdmin();

    const loadData = async () => {
        try {
            const res = await userApi.getAll();
            setUsers(res.data);
        } catch (err) { console.error(err); }
    };

    // Mở modal tạo mới
    const handleAdd = () => { setEditData(null); setOpen(true); };
    // Mở modal sửa
    const handleEdit = (user) => { setEditData(user); setOpen(true); };

    // Xử lý Lưu (Create hoặc Update)
    const handleSubmit = async (data) => {
        try {
            if (editData) {
                await userApi.update(editData.id, data); // API Update
            } else {
                await userApi.create(data); // API Create (Register)
            }
            setOpen(false);
            loadData(); // Reload bảng
        } catch (err) { alert("Lỗi: " + (err.response?.data?.message || err.message)); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa user này?")) return;
        try { await userApi.delete(id); loadData(); } catch (err) { alert("Lỗi xóa!"); }
    };

    useEffect(() => { loadData(); }, []);

    return (
        <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Quản lý Users</Typography>
                {isUserAdmin && (
                    <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
                        Thêm User
                    </Button>
                )}
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.username}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.fullName}</TableCell>
                                <TableCell>{row.role}</TableCell>
                                {isUserAdmin && (
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => handleEdit(row)}>
                                            <EditOutlined />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                            <DeleteOutlined />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal Form */}
            <UserForm open={open} handleClose={() => setOpen(false)} handleSubmit={handleSubmit} initialData={editData} />
        </Stack>
    );
}

// --- 2. FOREST TABLE ---
export function ForestTable() {
    const [forests, setForests] = useState([]);
    const [landOwners, setLandOwners] = useState([]); // Cần list chủ rừng để hiện dropdown
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const isUserAdmin = isAdmin();

    const loadData = async () => {
        try {
            const [resForest, resOwner] = await Promise.all([forestApi.getAll(), landOwnerApi.getAll()]);
            setForests(resForest.data);
            setLandOwners(resOwner.data);
        } catch (err) { console.error(err); }
    };

    const handleAdd = () => { setEditData(null); setOpen(true); };
    const handleEdit = (item) => { setEditData(item); setOpen(true); };

    const handleSubmit = async (data) => {
        try {
            if (editData) await forestApi.update(editData.id, data);
            else await forestApi.create(data);
            setOpen(false);
            loadData();
        } catch (err) { alert("Lỗi: " + (err.response?.data?.message || err.message)); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa rừng này?")) return;
        try { await forestApi.delete(id); loadData(); } catch (err) { alert("Lỗi xóa!"); }
    };

    useEffect(() => { loadData(); }, []);

    return (
        <Stack spacing={2} sx={{ mt: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Quản lý Khu vực Rừng</Typography>
                {isUserAdmin && (
                    <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>Thêm Rừng</Button>
                )}
            </Stack>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                        <TableRow>
                            <TableCell>Code</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Diện tích</TableCell>
                            <TableCell>Chủ sở hữu</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {forests.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell><b>{row.code}</b></TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.area}</TableCell>
                                <TableCell>{row.landOwnerName}</TableCell>
                                {isUserAdmin && (
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => handleEdit(row)}>
                                            <EditOutlined />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                            <DeleteOutlined />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal Form - Truyền thêm list landOwners */}
            <ForestForm
                open={open}
                handleClose={() => setOpen(false)}
                handleSubmit={handleSubmit}
                initialData={editData}
                landOwners={landOwners}
            />
        </Stack>
    );
}

// --- 3. LANDOWNER TABLE ---
export function LandOwnerTable() {
    const [owners, setOwners] = useState([]);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const isUserAdmin = isAdmin();

    const loadData = async () => {
        try {
            const res = await landOwnerApi.getAll();
            setOwners(res.data);
        } catch (err) { console.error(err); }
    };

    const handleAdd = () => { setEditData(null); setOpen(true); };
    const handleEdit = (item) => { setEditData(item); setOpen(true); };

    const handleSubmit = async (data) => {
        try {
            if (editData) await landOwnerApi.update(editData.id, data);
            else await landOwnerApi.create(data);
            setOpen(false);
            loadData();
        } catch (err) { alert("Lỗi: " + (err.response?.data?.message || err.message)); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa chủ rừng?")) return;
        try { await landOwnerApi.delete(id); loadData(); } catch (err) { alert("Không thể xóa!"); }
    };

    useEffect(() => { loadData(); }, []);

    return (
        <Stack spacing={2} sx={{ mt: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Quản lý Chủ Rừng</Typography>
                {isUserAdmin && (
                    <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>Thêm Chủ Rừng</Button>
                )}
            </Stack>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#e8f5e9' }}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {owners.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                {isUserAdmin && (
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => handleEdit(row)}>
                                            <EditOutlined />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                            <DeleteOutlined />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <LandOwnerForm open={open} handleClose={() => setOpen(false)} handleSubmit={handleSubmit} initialData={editData} />
        </Stack>
    );
}