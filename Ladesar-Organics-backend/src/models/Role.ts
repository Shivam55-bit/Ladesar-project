import mongoose from 'mongoose';

export interface IRole extends mongoose.Document {
  name: string;
  permissions: string[];
}

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    permissions: [
      {
        type: String,
        enum: [
          'View', 'Create', 'Edit', 'Delete', 'Import', 'Export', 
          'Publish', 'Unpublish', 'Approve', 'Reject', 'Settings Access'
        ]
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model<IRole>('Role', roleSchema);

export default Role;
