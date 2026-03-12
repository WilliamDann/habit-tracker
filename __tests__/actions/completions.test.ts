import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const mockInsert = vi.fn();
const mockDeleteEq = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "user-123" } },
      }),
    },
    from: vi.fn(() => ({
      insert: mockInsert,
      delete: () => ({
        eq: () => ({
          eq: () => ({
            eq: mockDeleteEq,
          }),
        }),
      }),
    })),
  }),
}));

describe("completions actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockResolvedValue({ error: null });
    mockDeleteEq.mockResolvedValue({ error: null });
  });

  it("toggleCompletion inserts when not completed", async () => {
    const { toggleCompletion } = await import("@/actions/completions");
    await toggleCompletion("habit-1", "2025-01-15", false);

    expect(mockInsert).toHaveBeenCalledWith({
      habit_id: "habit-1",
      user_id: "user-123",
      completed_date: "2025-01-15",
    });
  });

  it("toggleCompletion deletes when already completed", async () => {
    const { toggleCompletion } = await import("@/actions/completions");
    await toggleCompletion("habit-1", "2025-01-15", true);

    expect(mockDeleteEq).toHaveBeenCalled();
    expect(mockInsert).not.toHaveBeenCalled();
  });
});
