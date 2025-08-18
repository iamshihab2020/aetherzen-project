
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
  useGetPrescriptionsQuery,
  useApprovePrescriptionMutation,
  useRejectPrescriptionMutation,
} from "@/store/slices/api/api.slice";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const PrescriptionsPage = () => {
  const { data, isLoading, isError } = useGetPrescriptionsQuery();
  const [approvePrescription] = useApprovePrescriptionMutation();
  const [rejectPrescription] = useRejectPrescriptionMutation();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [prescriptionsPerPage] = useState(10);

  useEffect(() => {
    if (data) {
      setPrescriptions(data);
    }
  }, [data]);

  const handleApprove = async (id: string) => {
    try {
      await approvePrescription(id).unwrap();
      toast.success("Prescription approved successfully");
    } catch (error) {
      toast.error("Failed to approve prescription");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectPrescription(id).unwrap();
      toast.success("Prescription rejected successfully");
    } catch (error) {
      toast.error("Failed to reject prescription");
    }
  };

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPrescription = currentPage * prescriptionsPerPage;
  const indexOfFirstPrescription = indexOfLastPrescription - prescriptionsPerPage;
  const currentPrescriptions = filteredPrescriptions.slice(
    indexOfFirstPrescription,
    indexOfLastPrescription
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Prescriptions</h1>
        <Input
          type="text"
          placeholder="Search prescriptions..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Error loading prescriptions
              </TableCell>
            </TableRow>
          ) : (
            currentPrescriptions.map((prescription) => (
              <TableRow key={prescription.id}>
                <TableCell>{prescription.patient.name}</TableCell>
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
                  {prescription.status === "PENDING" && (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => handleApprove(prescription.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleReject(prescription.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
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
      <div className="flex justify-center mt-4">
        <nav>
          <ul className="flex items-center -space-x-px h-8 text-sm">
            <li>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Previous
              </button>
            </li>
            {Array.from({ length: Math.ceil(filteredPrescriptions.length / prescriptionsPerPage) }, (_, i) => (
              <li key={i}>
                <button
                  onClick={() => paginate(i + 1)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                    currentPage === i + 1 ? "bg-gray-200" : ""
                  }`}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredPrescriptions.length / prescriptionsPerPage)}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default PrescriptionsPage;
