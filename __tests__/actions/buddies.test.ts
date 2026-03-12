import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockUpdate = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "user-123" } },
      }),
    },
    from: vi.fn(() => ({
      insert: mockInsert,
      select: () => ({
        eq: () => ({
          single: mockSelect,
        }),
      }),
      update: (data: any) => ({
        eq: mockUpdate,
      }),
    })),
  }),
}));

describe("buddies actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockResolvedValue({ error: null });
    mockSelect.mockResolvedValue({ data: { id: "target-456" } });
    mockUpdate.mockResolvedValue({ error: null });
  });

  it("sendBuddyRequest looks up user and inserts request", async () => {
    const { sendBuddyRequest } = await import("@/actions/buddies");
    const result = await sendBuddyRequest("alice");
    expect(result).toEqual({});
  });

  it("sendBuddyRequest returns error if user not found", async () => {
    mockSelect.mockResolvedValue({ data: null });
    const { sendBuddyRequest } = await import("@/actions/buddies");
    const result = await sendBuddyRequest("nonexistent");
    expect(result).toEqual({ error: "User not found" });
  });

  it("acceptRequest updates status to accepted", async () => {
    const { acceptRequest } = await import("@/actions/buddies");
    await acceptRequest("req-789");
    expect(mockUpdate).toHaveBeenCalledWith("id", "req-789");
  });

  it("createInviteCode inserts a request with invite code", async () => {
    const { createInviteCode } = await import("@/actions/buddies");
    const result = await createInviteCode();
    expect(result).toHaveProperty("code");
    expect(typeof result.code).toBe("string");
    expect(mockInsert).toHaveBeenCalled();
  });
});
