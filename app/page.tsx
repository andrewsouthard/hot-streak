"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

type Habit = {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  target_count: number;
  created_at: string;
  updated_at: string;
};

type HabitCompletion = {
  id: string;
  habit_id: string;
  user_id: string;
  completion_date: string;
  count: number;
  target_count: number; // Added target_count property
};

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitIcon, setNewHabitIcon] = useState("");
  const [newHabitTargetCount, setNewHabitTargetCount] = useState<number>(1);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchHabits();
    fetchCompletions();
  }, []);

  const fetchHabits = async () => {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching habits:", error);
    } else {
      setHabits(data || []);
    }
  };

  const addHabit = async () => {
    if (!newHabitName.trim() || !newHabitIcon || newHabitTargetCount < 1)
      return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const { data, error } = await supabase
      .from("habits")
      .insert([
        {
          user_id: user.id,
          name: newHabitName,
          icon: newHabitIcon,
          target_count: newHabitTargetCount,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding habit:", error);
    } else if (data) {
      setHabits([...habits, data[0]]);
      setNewHabitName("");
      setNewHabitIcon("");
      setNewHabitTargetCount(1);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setNewHabitIcon(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const deleteHabit = async (id: string) => {
    const { error } = await supabase.from("habits").delete().eq("id", id);

    if (error) {
      console.error("Error deleting habit:", error);
    } else {
      setHabits(habits.filter((habit) => habit.id !== id));
    }
  };
  const fetchCompletions = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("habit_completions")
      .select("*")
      .eq("completion_date", today);

    if (error) {
      console.error("Error fetching completions:", error);
    } else {
      setCompletions(data || []);
    }
  };
  const incrementCompletion = async (habitId: string) => {
    const today = new Date().toISOString().split("T")[0];
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const habit = habits.find((h) => h.id === habitId);
    if (!habit) {
      console.error("Habit not found");
      return;
    }

    const existingCompletion = completions.find(
      (c) => c.habit_id === habitId && c.completion_date === today
    );

    if (existingCompletion) {
      const { data, error } = await supabase
        .from("habit_completions")
        .update({ count: existingCompletion.count + 1 })
        .eq("id", existingCompletion.id)
        .select();

      if (error) {
        console.error("Error updating completion:", error);
      } else if (data) {
        setCompletions(
          completions.map((c) => (c.id === data[0].id ? data[0] : c))
        );
      }
    } else {
      const { data, error } = await supabase
        .from("habit_completions")
        .insert([
          {
            habit_id: habitId,
            user_id: user.id,
            completion_date: today,
            count: 1,
            target_count: habit.target_count, // Include target count
          },
        ])
        .select();

      if (error) {
        console.error("Error adding completion:", error);
      } else if (data) {
        setCompletions([...completions, data[0]]);
      }
    }
  };
  const getCompletionCount = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0];
    const completion = completions.find(
      (c) => c.habit_id === habitId && c.completion_date === today
    );
    return completion ? completion.count : 0;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold">Daily Habits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="New habit name"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
            />
            <div className="relative">
              <Button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                variant="outline"
              >
                {newHabitIcon || "Select Icon"}
              </Button>
              {showEmojiPicker && (
                <div className="absolute z-10 top-full mt-2">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
            <Input
              type="number"
              placeholder="Target count"
              value={newHabitTargetCount}
              onChange={(e) => setNewHabitTargetCount(Number(e.target.value))}
              min={1}
            />
            <Button onClick={addHabit}>
              <PlusIcon className="h-5 w-5" />
              <span className="sr-only">Add Habit</span>
            </Button>
          </div>
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center justify-between bg-primary/10 rounded-md p-4"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{habit.icon}</div>
                <div>
                  <div className="font-medium">{habit.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Progress: {getCompletionCount(habit.id)} /{" "}
                    {habit.target_count}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(habit.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => incrementCompletion(habit.id)}
                >
                  <CheckIcon className="h-6 w-6 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteHabit(habit.id)}
                >
                  <TrashIcon className="h-5 w-5 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2 text-primary">
          <CalendarIcon className="h-5 w-5" />
          <div className="text-sm font-medium">
            Congratulations! You have a 5-day streak.
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

interface TrashIconProps {
  className?: string;
}

const TrashIcon: React.FC<TrashIconProps> = ({ className = "h-6 w-6" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
};
