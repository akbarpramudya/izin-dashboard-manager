
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { users, departments } from '@/lib/mock-data';
import { User, UserRole } from '@/types';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  role: z.enum(['admin', 'employee', 'security'] as const),
  departmentId: z.string().optional(),
});

const AdminUsers = () => {
  const [usersList, setUsersList] = useState<User[]>(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'employee',
      departmentId: undefined,
    },
  });
  
  const filteredUsers = usersList.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddUser = (values: z.infer<typeof formSchema>) => {
    // In a real app, this would be an API call
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: values.name,
      email: values.email,
      role: values.role,
      departmentId: values.departmentId,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(values.name)}&background=0D8ABC&color=fff`,
    };
    
    setUsersList([...usersList, newUser]);
    
    toast({
      title: 'User Added',
      description: `${newUser.name} has been added successfully.`,
    });
    
    setIsAddUserOpen(false);
    form.reset();
  };
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
    });
    setIsEditUserOpen(true);
  };
  
  const handleUpdateUser = (values: z.infer<typeof formSchema>) => {
    if (!selectedUser) return;
    
    // In a real app, this would be an API call
    const updatedUsers = usersList.map(user => 
      user.id === selectedUser.id
        ? { ...user, ...values }
        : user
    );
    
    setUsersList(updatedUsers);
    
    toast({
      title: 'User Updated',
      description: `${values.name} has been updated successfully.`,
    });
    
    setIsEditUserOpen(false);
    setSelectedUser(null);
  };
  
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserOpen(true);
  };
  
  const confirmDeleteUser = () => {
    if (!selectedUser) return;
    
    // In a real app, this would be an API call
    const updatedUsers = usersList.filter(user => user.id !== selectedUser.id);
    
    setUsersList(updatedUsers);
    
    toast({
      