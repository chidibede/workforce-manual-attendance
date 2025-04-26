import { useSearchWorker } from "../services/search";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import { useEffect, useState } from "react";
import {
  useAttendance,
  useManualAttendance,
  useWorkerUpdate,
} from "../services/attendance";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { capitalize } from "lodash";
import { campusoptions, leaderTeams, workerrolesoptions } from "../utils/teams";
import Select from "./Dropdown";

const AttendanceV2 = () => {
  const { debouncedSearch, search: searchValue } = useDebouncedSearch();
  const { data: filteredPeople, isLoading } = useSearchWorker(searchValue);
  const { mutate: markAttendanceMutation } = useAttendance();
  const { mutate: manualAttendanceMutation } = useManualAttendance();
  const { mutate: updateWorker } = useWorkerUpdate();
  const [query, setQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mutateIsLoadingId, setMutateIsLoadingId] = useState(0);
  const [manuallySaving, setManuallySaving] = useState(false);
  const [isEditSaving, setIsEditSaving] = useState(false);
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

  const [activePerson, setActivePerson] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    team: "",
    fullname: "",
    workerrole: "",
    campus: "",
  });
  const title = "Group Alpha Leaders Meeting - April 2025";

  const handleSearch = (e) => {
    setQuery(e.target.value);
    debouncedSearch(
      e.target.value.startsWith(0)
        ? e.target.value.replace(0, "")
        : e.target.value
    );
  };

  const handleCreate = () => {
    setIsCreating(true);
  };

  const resetCreate = () => {
    setIsCreating(false);
  };

  const resetEdit = () => {
    setIsEditing(false);
  };

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
          setManuallySaving(false);
          setIsCreating(false);
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
          setIsCreating(false);
          throw error;
        },
      }
    );
  };

  const handleUpdate = () => {
    if (!activePerson.team || activePerson.team === "All") {
      toast.error("Team is missing");
      return;
    }

    if (!activePerson.campus || activePerson.campus === "All") {
      toast.error("Campus is missing");
      return;
    }

    if (!activePerson.phonenumber) {
      toast.error("Name or phone number is missing");
      return;
    }
    const isPresentKey = "ispresent";
    setIsEditSaving(true);
    updateWorker(
      {
        ...activePerson,
        fullname:
          `${activePerson.firstname.trim()} ${activePerson.lastname.trim()}`.trim(),
        [isPresentKey]: true,
      },
      {
        onSuccess() {
          toast.success("Attendance manually added successfully");
          queryClient.invalidateQueries();
          setActivePerson({
            firstname: "",
            lastname: "",
            phonenumber: "",
            team: "",
            fullname: "",
            campus: "",
            workerrole: "",
          });
          setIsEditSaving(false);
          setIsEditing(false);
        },
        onError(error) {
          setIsEditSaving(false);
          setIsEditing(false);
          throw error;
        },
      }
    );
  };

  const handleMarkPresent = (person) => {
    setMutateIsLoadingId(person.id);
    markAttendanceMutation(person, {
      onSuccess() {
        toast.success("Attendance marked successfully");
        setMutateIsLoadingId(0);
        queryClient.invalidateQueries();
      },
      onError(error) {
        setMutateIsLoadingId(0);
        throw error;
      },
    });
  };

  const handleEdit = (person) => {
    // Implement edit functionality
    setIsEditing(true);
    setActivePerson(person);
  };

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
          {/* Search Input */}
          {!isEditing && (
            <input
              type="text"
              placeholder="Search by name or phone number"
              className="w-full mb-4 p-2 h-14 border rounded-lg"
              value={query}
              onChange={handleSearch}
            />
          )}

          {/* Search Results attendance*/}
          {!isCreating &&
          !isEditing &&
          searchValue &&
          filteredPeople?.length > 0 ? (
            <div>
              <ul className="space-y-2">
                {filteredPeople?.map((person, index) => (
                  <li
                    key={index}
                    className="p-4 border rounded-lg flex justify-between items-center"
                  >
                    <div className="flex flex-col">
                      <span>
                        {person.firstname} {person.lastname}
                      </span>
                      <span>
                        {person.campus}
                      </span>
                      {person.workerrole && (
                        <span className="opacity-60">{person.workerrole}</span>
                      )}
                      {person.team ? (
                        <span className="opacity-50">
                          {person?.team}
                        </span>
                      ) : (
                        <span>{person.team}</span>
                      )}
                    </div>
                    {person.ispresent ? (
                      <div className="flex space-x-4">
                        <button className="px-2 py-2 text-sm bg-green-500 text-white rounded-lg flex justify-between cursor-not-allowed">
                          <CheckBadgeIcon className="text-white size-5" />
                          <span className="ml-3">Present</span>
                        </button>
                        {/* <button
                          onClick={() => handleEdit(person)}
                          className="px-8 py-2 text-sm bg-blue-500 text-white cursor-pointer rounded-lg flex"
                        >
                          Open
                        </button> */}
                      </div>
                    ) : (
                      <div className="flex space-x-4">
                        {/* <button
                          onClick={() =>
                            mutateIsLoadingId === 0
                              ? handleMarkPresent(person)
                              : undefined
                          }
                          className="px-2 py-2 text-sm bg-blue-500 text-white rounded-lg cursor-pointer flex"
                        >
                          {mutateIsLoadingId === person.id
                            ? "Marking..."
                            : "Mark Present"}
                        </button> */}
                        <button
                          onClick={() => handleEdit(person)}
                          className="px-8 py-2 text-sm bg-blue-500 text-white cursor-pointer rounded-lg flex"
                        >
                          Open
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="items-center text-center">
                <div className="mt-6">OR</div>
                <button
                  onClick={handleCreate}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Manually add attendance
                </button>
              </div>
            </div>
          ) : (
            <>
              {!isCreating && !isEditing && (
                <div className="text-center my-4">
                  {isLoading && searchValue ? (
                    <p>Searching...</p>
                  ) : !isLoading && searchValue ? (
                    <div>
                      <p>No results</p>
                      <button
                        onClick={handleCreate}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                      >
                        Manually add attendance
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </>
          )}

          {/* Create Form */}
          {isCreating && (
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
          )}
          {/* Edit Form */}
          {isEditing && (
            <div className="mt-1">
              <h2 className="text-xl font-bold mb-4 text-center">
                Confirm leader info
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full p-2 border rounded-lg"
                  value={activePerson.firstname}
                  onChange={(e) =>
                    setActivePerson({
                      ...activePerson,
                      firstname: capitalize(e.target.value),
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full p-2 border rounded-lg"
                  value={activePerson.lastname}
                  onChange={(e) =>
                    setActivePerson({
                      ...activePerson,
                      lastname: capitalize(e.target.value),
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="w-full p-2 border rounded-lg"
                  value={activePerson.phonenumber}
                  onChange={(e) =>
                    setActivePerson({
                      ...activePerson,
                      phonenumber: e.target.value,
                    })
                  }
                />
                <div>
                  <Select
                    options={leaderTeams}
                    defaultValue={activePerson.team}
                    onChange={(value) => {
                      setActivePerson({
                        ...activePerson,
                        team: value,
                      });
                    }}
                    className="mb-3"
                  />
                </div>
                <div>
                  <Select
                    options={workerrolesoptions}
                    defaultValue={activePerson.workerrole}
                    onChange={(value) => {
                      setActivePerson({
                        ...activePerson,
                        workerrole: value,
                      });
                    }}
                    className="mb-3"
                  />
                </div>
                <div>
                  <Select
                    options={campusoptions}
                    defaultValue={activePerson.campus}
                    onChange={(value) => {
                      setActivePerson({
                        ...activePerson,
                        campus: value,
                      });
                    }}
                    className="mb-3"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={resetEdit}
                    className="w-full py-2 bg-red-500 text-white rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => (!isEditSaving ? handleUpdate() : undefined)}
                    className="w-full py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
                  >
                    {isEditSaving ? "Marking..." : "Mark Attendance"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceV2;
