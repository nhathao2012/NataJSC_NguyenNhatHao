import { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Select, MenuItem, FormControl, InputLabel, Stack
} from '@mui/material';

// --- FORM USER ---
export function UserForm({ open, handleClose, handleSubmit, initialData }) {
    const [formData, setFormData] = useState({
        username: '', password: '', email: '', fullName: '', role: 'User'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData, password: '' });
        } else {
            setFormData({ username: '', password: '', email: '', fullName: '', role: 'User' });
        }
    }, [initialData, open]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{initialData ? 'Cập nhật User' : 'Thêm User mới'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
                    <TextField label="Username" fullWidth value={formData.username}
                        disabled={!!initialData} // Không cho sửa Username khi edit
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })} />

                    {/* Chỉ hiện ô Password khi tạo mới */}
                    {!initialData && (
                        <TextField label="Password" type="password" fullWidth value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    )}

                    <TextField label="Full Name" fullWidth value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                    <TextField label="Email" fullWidth value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

                    <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select value={formData.role} label="Role"
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                            <MenuItem value="User">User</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Hủy</Button>
                <Button onClick={() => handleSubmit(formData)} variant="contained">Lưu</Button>
            </DialogActions>
        </Dialog>
    );
}

// --- FORM LAND OWNER ---
export function LandOwnerForm({ open, handleClose, handleSubmit, initialData }) {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

    useEffect(() => {
        if (initialData) setFormData(initialData);
        else setFormData({ name: '', email: '', phone: '', address: '' });
    }, [initialData, open]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{initialData ? 'Sửa Chủ rừng' : 'Thêm Chủ rừng'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
                    <TextField label="Tên chủ rừng" fullWidth value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <TextField label="Email" fullWidth value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    <TextField label="SĐT" fullWidth value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    <TextField label="Địa chỉ" fullWidth value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button onClick={() => handleSubmit(formData)} variant="contained">Lưu</Button>
            </DialogActions>
        </Dialog>
    );
}

// --- FORM FOREST AREA ---
export function ForestForm({ open, handleClose, handleSubmit, initialData, landOwners }) {
    // 1. Thêm 'location' vào state mặc định
    const [formData, setFormData] = useState({
        code: '', name: '', area: '', treeType: '', 
        status: '', plantYear: '', landOwnerId: '', location: '' 
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Reset form khi tạo mới
            setFormData({ 
                code: '', name: '', area: '', treeType: '', 
                status: 'Phủ xanh', plantYear: '', landOwnerId: '', location: '' 
            });
        }
    }, [initialData, open]);

    // Hàm wrapper để xử lý dữ liệu trước khi submit
    const onSave = () => {
        // Convert dữ liệu sang đúng kiểu Backend cần
        const payload = {
            ...formData,
            // Convert sang số, nếu rỗng thì để 0 hoặc null tuỳ logic của bạn
            area: Number(formData.area) || 0, 
            plantYear: Number(formData.plantYear) || new Date().getFullYear(),
            landOwnerId: Number(formData.landOwnerId) // Bắt buộc phải là số
        };

        // Validate cơ bản
        if(!payload.landOwnerId) {
            alert("Vui lòng chọn Chủ sở hữu!");
            return;
        }

        handleSubmit(payload);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{initialData ? 'Sửa Rừng' : 'Thêm Rừng Mới'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
                    <TextField label="Mã Rừng (Code)" fullWidth value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                    
                    <TextField label="Tên Khu Vực" fullWidth value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

                    {/* 2. Thêm ô nhập Location đang bị thiếu */}
                    <TextField label="Vị trí (Location)" fullWidth value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                    
                    <TextField label="Diện tích (ha)" type="number" fullWidth value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
                    
                    <TextField label="Loại cây" fullWidth value={formData.treeType}
                        onChange={(e) => setFormData({ ...formData, treeType: e.target.value })} />
                    
                    <TextField label="Năm trồng" type="number" fullWidth value={formData.plantYear}
                        onChange={(e) => setFormData({ ...formData, plantYear: e.target.value })} />
                    
                    <TextField label="Trạng thái" fullWidth value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })} />

                    <FormControl fullWidth>
                        <InputLabel>Chủ sở hữu</InputLabel>
                        <Select value={formData.landOwnerId} label="Chủ sở hữu"
                            onChange={(e) => setFormData({ ...formData, landOwnerId: e.target.value })}>
                            {landOwners.map((owner) => (
                                <MenuItem key={owner.id} value={owner.id}>
                                    {owner.name} ({owner.id})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                {/* Gọi onSave thay vì handleSubmit trực tiếp */}
                <Button onClick={onSave} variant="contained">Lưu</Button>
            </DialogActions>
        </Dialog>
    );
}