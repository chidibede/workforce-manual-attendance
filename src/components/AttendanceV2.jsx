import { useSearchWorker } from "../services/search";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import { useEffect, useState } from "react";
import {
  useAttendance,
  useManualAttendance,
  useWorkerUpdate,
} from "../services/attendance";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { capitalize } from "lodash";
import { campusoptions, leaderTeams, workerrolesoptions } from "../utils/teams";
import Select from "./Dropdown";

const AttendanceV2 = () => {
  const { debouncedSearch, search: searchValue } = useDebouncedSearch();
  const { mutate: markAttendanceMutation } = useAttendance();
  const { mutate: manualAttendanceMutation } = useManualAttendance();
  const [manuallySaving, setManuallySaving] = useState(false);
  const [isCreatingCompleted, setIsCreatingCompleted] = useState(false);
  const queryClient = useQueryClient();
  const [newPerson, setNewPerson] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    team: "",
    fullname: "",
    workerrole: "",
    campus: "",
  });

  const title = "Group Alpha Leaders Meeting - April 2025";

  const handleSave = () => {
    if (!newPerson.team || newPerson.team === "All") {
      toast.error("Team is missing");
      return;
    }
    if (!newPerson.campus || newPerson.campus === "All") {
      toast.error("Campus is missing");
      return;
    }
    if (!newPerson.phonenumber) {
      toast.error("Phone number is missing");
      return;
    }

    const isPresentKey = "ispresent";
    setManuallySaving(true);
    manualAttendanceMutation(
      {
        ...newPerson,
        fullname:
          `${newPerson.firstname.trim()} ${newPerson.lastname.trim()}`.trim(),
        [isPresentKey]: true,
      },
      {
        onSuccess() {
          toast.success("Attendance manually added successfully");
          queryClient.invalidateQueries();
          setNewPerson({
            firstname: "",
            lastname: "",
            phonenumber: "",
            team: "",
            fullname: "",
            campus: "",
            workerrole: "",
          });
          setIsCreatingCompleted(true);
          setManuallySaving(false);
        },
        onError(error) {
          setNewPerson({
            firstname: "",
            lastname: "",
            phonenumber: "",
            team: "",
            fullname: "",
            campus: "",
            workerrole: "",
          });
          setManuallySaving(false);
          setIsCreatingCompleted(true);
          throw error;
        },
      }
    );
  };

  const resetCreate = () => {
    setIsCreatingCompleted(true);
    setNewPerson({
      firstname: "",
      lastname: "",
      phonenumber: "",
      team: "",
      fullname: "",
      campus: "",
      workerrole: "",
    });
  };

  if (isCreatingCompleted) {
    return (
      <>
        <header className="text-center mb-4 mt-1">
          <img
            src="/logo.jpg"
            alt="Harvesters International Christian Center Logo"
            className="w-32 h-32 mx-auto"
          />
          <h1 className="text-2xl font-bold mt-4">
            Harvesters International Christian Centre, Gbagada campus
          </h1>
          <h2 className="text-2xl font-bold text-gray-500 mt-4">{title}</h2>
        </header>
        <div className="bg-green-100 text-green-800 px-4 py-3 rounded-2xl shadow-md w-fit mx-auto mt-10">
          <p className="text-base font-medium">
            Attendance marked. <span className="font-semibold">Refresh</span> to
            mark again.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:items-center bg-gray-50 p-4">
      <div className="lg:w-5/12">
        {/* Header with Logo and Title */}
        <header className="text-center mb-4 mt-1">
          <img
            src="/logo.jpg"
            alt="Harvesters International Christian Center Logo"
            className="w-32 h-32 mx-auto"
          />
          <h1 className="text-2xl font-bold mt-4">
            Harvesters International Christian Centre, Gbagada campus
          </h1>
          <h2 className="text-2xl font-bold text-gray-500 mt-4">{title}</h2>
        </header>
        <div className="bg-white shadow-lg rounded-xl p-6 mb-24 mt-12">
          {/* Create Form */}

          <div className="mt-4">
            <h2 className="text-xl font-bold mb-4 text-center">
              Manually add attendance
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-2 border rounded-lg"
                value={newPerson.firstname}
                onChange={(e) =>
                  setNewPerson({
                    ...newPerson,
                    firstname: capitalize(e.target.value),
                  })
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-2 border rounded-lg"
                value={newPerson.lastname}
                onChange={(e) =>
                  setNewPerson({
                    ...newPerson,
                    lastname: capitalize(e.target.value),
                  })
                }
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-2 border rounded-lg"
                value={newPerson.phonenumber}
                onChange={(e) =>
                  setNewPerson({ ...newPerson, phonenumber: e.target.value })
                }
              />
              <div>
                <Select
                  options={leaderTeams}
                  onChange={(value) => {
                    setNewPerson({
                      ...newPerson,
                      team: value,
                    });
                  }}
                  className="mb-3"
                />
              </div>
              <div>
                <Select
                  options={workerrolesoptions}
                  onChange={(value) => {
                    setNewPerson({
                      ...newPerson,
                      workerrole: value,
                    });
                  }}
                  className="mb-3"
                />
              </div>
              <div>
                <Select
                  options={campusoptions}
                  onChange={(value) => {
                    setNewPerson({
                      ...newPerson,
                      campus: value,
                    });
                  }}
                  className="mb-3"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={resetCreate}
                  className="w-full py-2 bg-red-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => (!manuallySaving ? handleSave() : undefined)}
                  className="w-full py-2 bg-blue-500 text-white rounded-lg"
                >
                  {manuallySaving ? "Saving" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceV2;
