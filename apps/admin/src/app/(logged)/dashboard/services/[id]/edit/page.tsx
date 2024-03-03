"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getService } from "../../actions";
import Loader from "@/components/loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { updateService } from "../actions";
import { toast } from "sonner";
import { MutatedService, Service } from "@/types/index";
import { getImages } from "../../../actions";
import ApiImage from "@/components/ApiImage";
import { useMemo } from "react";
import Combobox from "@/components/Combobox";

export default function ServiceEdit() {
  const params = useParams<{ id: string }>();
  const { data: images, isFetched: isImagesFetched } = useQuery({
    queryKey: ["images"],
    queryFn: async () => getImages(),
  });
  const { data: service, isFetched } = useQuery({
    queryKey: ["service", +params.id],
    queryFn: async () => getService(+params.id),
  });
  const [serviceState, setServiceState] = useState<MutatedService>();
  const serviceMutation = useMutation({
    mutationFn: async (serviceState: MutatedService) => {
      console.log(serviceState);
      return await updateService(+params.id, {
        label: serviceState?.label,
        description: serviceState?.description,
        image: serviceState?.image,
      });
    },
    onError: (error) => {
      toast.error("server error");
    },
    onSuccess: (data) => {
      toast.success("Service updated");
    },
  });

  useEffect(() => {
    setServiceState(service?.data);
  }, [service]);

  const fileSelectItems = useMemo(
    () =>
      images?.data?.map((image) => {
        return {
          component: (
            <div>
              <ApiImage
                identifier={image.id}
                width={50}
                height={50}
                alt={"test"}
              />
            </div>
          ),
          label: image.file.name,
          value: image.id,
        };
      }),
    [images]
  );

  if (!isFetched) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  console.log(service?.data);

  return (
    <div className="flex flex-col gap-16 min-h-full justify-between">
      <div className="flex gap-4 lg:gap-16 w-full">
        <div className="flex flex-col w-full">
          <Label htmlFor="label">label</Label>
          <Input
            defaultValue={service?.data?.label}
            onChange={(e) =>
              setServiceState({ ...serviceState!, label: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col w-full">
          <Label htmlFor="description">description</Label>
          <Input
            defaultValue={service?.data?.description}
            onChange={(e) =>
              setServiceState({ ...serviceState!, description: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col w-full">
          <Label htmlFor="description">description</Label>
          <Combobox
            multiple={true}
            items={fileSelectItems || []}
            isLoading={!isImagesFetched}
            defaultPreviewText="Select an image..."
            defaultValue={
              service?.data?.image?.id ? [service?.data?.image?.id] : []
            }
            onSelect={(ids) =>
              setServiceState({
                ...serviceState!,
                image: ids
                  ? images?.data?.find((i) => ids.includes(i.id))
                  : null,
              })
            }
            keepOpen
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => serviceMutation.mutate(serviceState!)}>
          Save
        </Button>
      </div>
    </div>
  );
}
