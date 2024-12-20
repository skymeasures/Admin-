import { useState } from "react";
import { cn } from "@/lib/utils";
import { VerticalDots } from "@/constants/icons";
import { PopoverWrapper } from "@/components/ui/components/PopoverWrapper";
import FallbackLoader, { BtnLoader } from "@/components/fallback/FallbackLoader";
import { Modal } from "@/components/ui/components/Modal";
import {
  useApproveListing,
  useDeleteListing,
  useGetPropertyDetails,
  useUpdatePropertyPublishStatus,
} from "@/hooks/useListing";
import { toast } from "sonner";

import PostProperty from "@/components/forms/PostProperty";
import Details from "../_sections/Details";

const dropdownList = [
  { icon: "", label: "Approve", showLoader: true },
  { icon: "", label: "Reject", showLoader: true },
  { icon: "", label: "View details", showLoader: false },
  { icon: "", label: "Delete", showLoader: true },
];

function ListingActions({ data }: { data?: any }) {
  const [openModal, setOpenModal] = useState<false | "edit" | "details">(false);
  const approveListingMutation = useApproveListing();
  const publishUnpublishMutation = useUpdatePropertyPublishStatus();
  const deleteListingMutation = useDeleteListing();

  const { data: listingInfo, isLoading } = useGetPropertyDetails(data?.id || "", {
    enabled: !!data?.id && openModal === "details",
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const [loadingStates, setLoadingStates] = useState<boolean[]>(dropdownList!?.map(() => false));

  const onClickHandlers: { [index: number]: () => Promise<void> | void } = {
    0: async () => {
      const { id } = data;

      await approveListingMutation.mutateAsync(id);
      toast.success("Property approved successfully");
    },
    1: async () => {
      const { id } = data;

      await publishUnpublishMutation.mutateAsync({
        propertyId: id,
        type: "unpublish",
      });
      toast.success("Property unpublished successfully");
    },
    2: () => setOpenModal("details"),
    3: async () => {
      const { id } = data;

      await deleteListingMutation.mutateAsync(id);
      toast.success("Property deleted successfully");
    },
  };

  const handleItemClick = async (idx: number, showLoader?: boolean) => {
    if (!onClickHandlers || typeof onClickHandlers[idx] !== "function") return;

    if (showLoader) {
      setLoadingStates((prev) => {
        const newStates = [...prev];
        newStates[idx] = true;
        return newStates;
      });
    }

    try {
      await onClickHandlers[idx]();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      if (showLoader) {
        setLoadingStates((prev) => {
          const newStates = [...prev];
          newStates[idx] = false;
          return newStates;
        });
      }
    }
  };

  return (
    <>
      <PopoverWrapper
        trigger={
          <div className="icon-div w-full !size-8">
            <VerticalDots className="size-5" />
          </div>
        }
        containerStyles=""
        list={dropdownList}
        renderItem={(item, index) => {
          return (
            <>
              <div key={index} onClick={() => handleItemClick(index, item?.showLoader)}>
                <div className="row-flex-start w-full gap-2 cursor-pointer">
                  {item?.icon && <item.icon className={cn("size-4")} />}
                  <span className={cn("flex-1 leading-4 text-sm")}>{item?.label}</span>
                  <BtnLoader isLoading={loadingStates[index]} />
                </div>
              </div>
            </>
          );
        }}
      />

      {openModal === "details" && (
        <Modal
          openModal={openModal === "details"}
          setOpenModal={() => setOpenModal(false)}
          modalStyles={cn("max-w-xl max-h-[550px]", isLoading && "min-h-min")}
          title={data?.name || "Details"}
          // topContent={<Options data={listingInfo || data} setOpenModal={setOpenModal} />}
        >
          <>
            {isLoading ? (
              <div className="row-flex relative h-[150px] ">
                <FallbackLoader loading={isLoading} />
              </div>
            ) : (
              <div className="px-0.5 mt-6">
                <Details
                  data={listingInfo || data}
                  type="details"
                  closeModal={() => setOpenModal(false)}
                />
              </div>
            )}
          </>
        </Modal>
      )}

      {openModal === "edit" && (
        <Modal
          openModal={openModal === "edit"}
          setOpenModal={() => setOpenModal(false)}
          modalStyles="max-w-xl max-h-[550px]"
          title="Edit Property"
        >
          <div className="">
            {isLoading ? (
              <div className="row-flex relative h-[100px]">
                <FallbackLoader loading={isLoading} />
              </div>
            ) : (
              <div className="mt-6 px-0.5">
                <PostProperty
                  data={listingInfo || data}
                  type="edit"
                  closeModal={() => setOpenModal(false)}
                />
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

export default ListingActions;

const options = [
  { icon: "", label: "Approve", showLoader: true },
  { icon: "", label: "Reject", showLoader: true },
  { icon: "", label: "Edit", showLoader: false },
  { icon: "", label: "Flag", showLoader: true },
  { icon: "", label: "Delete", showLoader: true },
];

// @ts-ignore
const Options = ({
  data,
  setOpenModal,
}: {
  data: any;
  setOpenModal?: React.Dispatch<React.SetStateAction<false | "edit" | "details">>;
}) => {
  const approveListingMutation = useApproveListing();
  const publishUnpublishMutation = useUpdatePropertyPublishStatus();
  const deleteListingMutation = useDeleteListing();

  const [loadingStates, setLoadingStates] = useState<boolean[]>(options!?.map(() => false));

  const onClickHandlers: { [index: number]: () => any } = {
    0: async () => {
      const { id } = data;

      await approveListingMutation.mutateAsync(id);
      toast.success("Property approved successfully");
    },
    1: async () => {
      const { id } = data;

      await publishUnpublishMutation.mutateAsync({
        propertyId: id,
        type: "unpublish",
      });
      toast.success("Property unpublished successfully");
    },
    2: () => setOpenModal && setOpenModal("edit"),
    3: async () => {
      const { id } = data;

      await deleteListingMutation.mutateAsync(id);
      toast.success("Property deleted successfully");
    },
  };

  const handleItemClick = async (idx: number, showLoader?: boolean) => {
    if (!onClickHandlers || typeof onClickHandlers[idx] !== "function") return;

    if (showLoader) {
      setLoadingStates((prev) => {
        const newStates = [...prev];
        newStates[idx] = true;
        return newStates;
      });
    }

    try {
      await onClickHandlers[idx]();
    } finally {
      if (showLoader) {
        setLoadingStates((prev) => {
          const newStates = [...prev];
          newStates[idx] = false;
          return newStates;
        });
      }
    }
  };

  return (
    <PopoverWrapper
      trigger={
        <div className="icon-div w-full !size-8">
          <VerticalDots className="size-5" />
        </div>
      }
      containerStyles="z-[999] modal-popover-content"
      list={options}
      renderItem={(item, index) => {
        const isDelete = item?.label.includes("Delete");
        return (
          <div
            key={index}
            className="row-flex-start w-full gap-2 cursor-pointer"
            onClick={() => handleItemClick(index, item?.showLoader)}
          >
            {item?.icon && (
              <item.icon className={cn("size-4 font-medium", isDelete && "text-red-600")} />
            )}
            <span
              className={cn("flex-1 leading-4 font-medium text-sm", isDelete && "text-red-600")}
            >
              {item?.label}
            </span>

            <BtnLoader isLoading={loadingStates[index]} />
          </div>
        );
      }}
    />
  );
};
