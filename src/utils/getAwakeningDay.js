export const getAwakeningDay = () => {
    const today = new Date();
    const day = today.getDay();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const finalDay = daysOfWeek[day];
    return finalDay;
  };