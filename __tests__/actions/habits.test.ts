import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock supabase server client
const mockInsert = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "user-123" } },
      }),
    },
    from: vi.fn((table: string) => ({
      insert: mockInsert,
      delete: () => ({
        eq: (col: string, val: string) => ({
          eq: mockEq,
        }),
      }),
    })),
  }),
}));

describe("habits actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockResolvedValue({ error: null });
    mockEq.mockResolvedValue({ error: null });
  });

  it("createHabit inserts a habit", async () => {
    const { createHabit } = await import("@/actions/habits");
    await createHabit("Exercise", "#10b981", [0, 1, 2, 3, 4, 5, 6]);

    expect(mockInsert).toHaveBeenCalledWith({
      user_id: "user-123",
      name: "Exercise",
      color: "#10b981",
      frequency: [0, 1, 2, 3, 4, 5, 6],
    });
  });

  it("deleteHabit deletes a habit", async () => {
    const { deleteHabit } = await import("@/actions/habits");
    await deleteHabit("habit-456");
    expect(mockEq).toHaveBeenCalledWith("user_id", "user-123");
  });
});
