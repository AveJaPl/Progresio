// contexts/AppContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { IGoal } from "@/app/types/Goal";
import { Parameter } from "@/app/types/Parameter";
import { getData, postData } from "@/app/utils/sendRequest";
import { useToast } from "@/hooks/use-toast";

interface AppContextProps {
  goals: IGoal[];
  loadingGoals: boolean;
  loadingUpcomingGoals: boolean;
  refreshParameters: () => void;
  updateGoals: (data: string[]) => Promise<void>;
  activities: { action: string; date: string }[];
  goalProgress: { finished: number; total: number };
  parameterProgress: number;
  upcomingGoals: IGoal[];
  loadingProgress: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<IGoal[]>([]);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [upcomingGoals, setUpcomingGoals] = useState<IGoal[]>([]);
  const [loadingProgress, setLoadingProgress] = useState<boolean>(false);

  const [goalProgress, setGoalProgress] = useState<{
    finished: number;
    total: number;
  }>({ finished: 0, total: 0 });
  const [parameterProgress, setParametersProgress] = useState<number>(0);

  const [loadingGoals, setLoadingGoals] = useState<boolean>(false);
  const [loadingUpcomingGoals, setLoadingUpcomingGoals] =
    useState<boolean>(false);
  const [loadingParameters, setLoadingParameters] = useState<boolean>(false);

  const { toast } = useToast();

  const fetchUpcomingGoals = async () => {
    setLoadingUpcomingGoals(true);
    const { status, data } = await getData("/api/goals/upcoming");
    if (status !== 200) {
      toast({
        title: "Error",
        description: "Failed to fetch upcoming goals",
        variant: "destructive",
      });
      return;
    }
    setUpcomingGoals(data);
    setLoadingUpcomingGoals(false);
  };

  const fetchParameters = async () => {
    setLoadingParameters(true);
    try {
      const getResponse = await getData("/api/parameters");
      if (getResponse.status === 200) {
        setParameters(getResponse.data);
      } else {
        toast({
          title: "Error",
          description: "Parameters could not be fetched",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem fetching parameters",
        variant: "destructive",
      });
    } finally {
      setLoadingParameters(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const getResponse = await getData("/api/activities");
      if (getResponse.status === 200) {
        console.log(`Activities: ${getResponse.data}`);
      } else {
        toast({
          title: "Error",
          description: "Activities could not be fetched",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem fetching activities",
        variant: "destructive",
      });
    }
  };

  const fetchGoals = async () => {
    setLoadingGoals(true);
    setLoadingProgress(true);
    const { status, data } = await getData("/api/goals");

    if (status !== 200) {
      toast({
        title: "Error",
        description: "Failed to fetch goals",
        variant: "destructive",
      });
      return;
    }

    const activeGoals = data.filter((goal: IGoal) => goal.status === "Active");
  
    setGoals(activeGoals);
    setLoadingGoals(false);
    setLoadingProgress(false);
  };

  const fetchParametersProgressThisWeek = async () => {
    setLoadingProgress(true);
    const { status, data } = await getData("/api/parameters/this-week");
    if (status !== 200) {
      toast({
        title: "Error",
        description: "Failed to fetch parameters progress",
        variant: "destructive",
      });
      return;
    }
    console.log("Habit Progress:");
    console.log(data);
    setParametersProgress(data);
    setLoadingProgress(false);
  };

  const fetchGoalsProgressThisWeek = async () => {
    setLoadingProgress(true);
    const { status, data } = await getData("/api/goals/this-week");
    if (status !== 200) {
      toast({
        title: "Error",
        description: "Failed to fetch goals progress",
        variant: "destructive",
      });
      return;
    }
    console.log("Goal Progress:");
    console.log(data);
    setGoalProgress(data);
    setLoadingProgress(false);
  };

  useEffect(() => {
    fetchGoals();
    fetchUpcomingGoals();
    fetchParameters();
    fetchParametersProgressThisWeek();
    fetchGoalsProgressThisWeek();
    // fetchActivities();
  }, []);

  const refreshUpcomingGoals = () => {
    fetchUpcomingGoals();
  };

  const refreshGoals = () => {
    fetchGoals();
    fetchGoalsProgressThisWeek();
  };

  const refreshParameters = () => {
    fetchParameters();
    fetchParametersProgressThisWeek();
  };

  const activities = [
    { action: "Zalogowano się", date: "2023-10-01 12:34" },
    { action: "Edytowano profil", date: "2023-09-28 09:21" },
    { action: "Dodano nowy cel", date: "2023-09-25 15:47" },
    { action: "Zmieniono hasło", date: "2023-09-20 18:12" },
  ];

  const updateGoals = async (dataToUpdate: string[]) => {
    try {
      console.log(dataToUpdate);
      const { data, status } = await postData(`/api/goals/submit`, {
        data: dataToUpdate,
      });
      console.log(data);
      if (status === 201) {
        toast({
          title: "Success",
          description: "Goals updated",
        });
        refreshUpcomingGoals();
        refreshGoals();
      } else {
        toast({
          title: "Error",
          description: "Goals could not be updated",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating goals",
        variant: "destructive",
      });
    }
  };

  const updateParameter = async ({
    data,
    date,
    overwrite,
  }: {
    data: { id: string; value: any }[];
    date: Date;
    overwrite: boolean;
  }) => {
    // Konwertuj datę do formatu akceptowanego przez API (np. "YYYY-MM-DD")
    const formattedDate = date.toISOString().split("T")[0];

    // Przygotuj dane do wysłania
    const dataToPost = {
      date: formattedDate,
      data,
      overwrite,
    };

    try {
      const response = await postData(`/api/daily-parameters`, dataToPost);
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Parameters updated",
        });
        refreshParameters();
      } else if (response.status === 400) {
        toast({
          title: "Błąd",
          description: "Nie udało się zaktualizować parametrów",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się zaktualizować parametrów",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Wystąpił problem z aktualizacją parametrów",
        variant: "destructive",
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        goals, // tablica celów
        loadingGoals, // zmienna informująca o stanie ładowania celów
        updateGoals, // funkcja do aktualizacji celów -> przyjmuje tablice id celów do zmiany statusu na Completed
        refreshParameters, // Odświeżenie parametrów w komponentach statistics oraz activities
        activities, // tablica aktywności
        goalProgress, // postęp w realizacji celów
        parameterProgress, // postęp w realizacji parametrów
        upcomingGoals, // tablica nadchodzących celów
        loadingUpcomingGoals, // zmienna informująca o stanie ładowania nadchodzących celów
        loadingProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext musi być używany wewnątrz AppProvider");
  }
  return context;
};
