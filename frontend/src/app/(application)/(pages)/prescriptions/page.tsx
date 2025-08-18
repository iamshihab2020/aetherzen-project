
"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Prescription } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import {
  useGetMyPrescriptionsQuery,
  useUploadPrescriptionMutation,
} from "@/store/slices/api/api.slice";
import { toast } from "sonner";

const PrescriptionsPage = () => {
  const { data, isLoading, isError } = useGetMyPrescriptionsQuery();
  const [uploadPrescription, { isLoading: isUploading }] = useUploadPrescriptionMutation();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (data) {
      setPrescriptions(data);
    }
  }, [data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        await uploadPrescription(formData).unwrap();
        toast.success("Prescription uploaded successfully");
        setFile(null);
      } catch (error) {
        toast.error("Failed to upload prescription");
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Prescriptions</h1>
        <div className="flex items-center space-x-2">
          <input type="file" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Error loading prescriptions
              </TableCell>
            </TableRow>
          ) : (
            prescriptions.map((prescription) => (
              <TableRow key={prescription.id}>
                <TableCell>{prescription.doctor.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      prescription.status === "APPROVED"
                        ? "default"
                        : prescription.status === "REJECTED"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {prescription.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <a
                    href={`/api/prescriptions/${prescription.id}/file`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost">View</Button>
                  </a>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PrescriptionsPage;
