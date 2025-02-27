
import React from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PermissionType } from '@/types';
import { generateQRCode } from '@/lib/utils';

const formSchema = z.object({
  type: z.enum(['sick', 'vacation', 'personal', 'other'] as const),
  reason: z.string().min(5, {
    message: 'Reason must be at least 5 characters.',
  }),
  startTime: z.string().min(1, {
    message: 'Start time is required.',
  }),
  endTime: z.string().min(1, {
    message: 'End time is required.',
  }),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: 'End time must be after the start time',
  path: ['endTime'],
});

interface PermissionFormProps {
  onSubmit: (data: Required<z.infer<typeof formSchema>> & { qrCode?: string }) => void;
}

export const PermissionForm: React.FC<PermissionFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'personal',
      reason: '',
      startTime: '',
      endTime: '',
    },
  });
  
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      // In a real app, this would be a server call
      const permissionId = `perm-${Date.now()}`;
      const qrCode = generateQRCode(permissionId);
      
      // Ensure all values are required
      const formattedData = {
        type: values.type,
        reason: values.reason,
        startTime: values.startTime,
        endTime: values.endTime,
        qrCode: qrCode,
      };
      
      onSubmit(formattedData);
      
      form.reset();
      
      toast({
        title: 'Permission Request Submitted',
        description: 'Your permission request has been submitted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error submitting your permission request.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permission Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select permission type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="personal">Personal Leave</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of permission you are requesting.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please provide a reason for your permission request"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Briefly explain why you need this permission.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormDescription>
                  When do you need to start your leave?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormDescription>
                  When will you return from your leave?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full">Submit Permission Request</Button>
      </form>
    </Form>
  );
};
