"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Service, getService } from "../../actions";
import Loader from "@/components/loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MutatedService, updateService } from "../actions";
import { toast } from "sonner";
import FileSelect from "@/components/Combobox";

export default function ServiceEdit() {
    const params = useParams<{ id: string }>();
    const { data, isFetched } = useQuery({
        queryKey: ["service", +params.id],
        queryFn: async () => getService(+params.id)
    });
    const [service, setService] = useState<MutatedService>();
    const serviceMutation = useMutation({
        mutationFn: async (data?: MutatedService) => {
            return await updateService(+params.id, data);
        },
        onError: (error) => {
            toast.error("server error");
        },
        onSuccess: (data) => {
            toast.success("Service updated");
        }
    });

    useEffect(() => {
        setService(data?.data);
    }, [data]);

    if (!isFetched) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Loader />
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-16 min-h-full justify-between">
            <div className="flex gap-4 lg:gap-16 w-full">
                <div className="flex flex-col w-full">
                    <Label htmlFor="label">label</Label>
                    <Input defaultValue={data?.data?.label} onChange={(e) => setService({ ...service, label: e.target.value })} />
                </div>
                <div className="flex flex-col w-full">
                    <Label htmlFor="description">description</Label>
                    <Input defaultValue={data?.data?.description} onChange={(e) => setService({ ...service, description: e.target.value })} />
                </div>
                <FileSelect items={[{component: "test", label: "test", value: "test"}]}/>
            </div>
            <div className="flex justify-end">
                <Button onClick={() => serviceMutation.mutate(service)}>Save</Button>
            </div>
        </div>
    );
}
