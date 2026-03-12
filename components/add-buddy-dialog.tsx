"use client";

import { useRef, useState } from "react";
import { sendBuddyRequest, createInviteCode } from "@/actions/buddies";

export function AddBuddyDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [username, setUsername] = useState("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSendRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setError(null);
    setLoading(true);

    const result = await sendBuddyRequest(username.trim());
    if (result?.error) {
      setError(result.error);
    } else {
      setUsername("");
      dialogRef.current?.close();
    }
    setLoading(false);
  }

  async function handleGenerateLink() {
    setError(null);
    const result = await createInviteCode();
    if (result?.error) {
      setError(result.error);
    } else if (result?.code) {
      setInviteLink(`${window.location.origin}/invite/${result.code}`);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setInviteLink(null);
          setError(null);
          dialogRef.current?.showModal();
        }}
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Add Buddy
      </button>

      <dialog
        ref={dialogRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 text-stone-900 shadow-lg backdrop:bg-black/50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
      >
        <h2 className="mb-4 text-lg font-semibold">Add a Buddy</h2>

        <form onSubmit={handleSendRequest} className="space-y-3">
          <div>
            <label htmlFor="buddy-username" className="block text-sm font-medium">
              Search by username
            </label>
            <input
              id="buddy-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-stone-700 dark:bg-stone-800"
              placeholder="username"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Send Request
          </button>
        </form>

        <div className="my-4 border-t border-stone-200 dark:border-stone-700" />

        <div className="space-y-2">
          <p className="text-sm font-medium">Or share an invite link</p>
          <button
            onClick={handleGenerateLink}
            className="rounded-md bg-stone-100 px-4 py-2 text-sm text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
          >
            Generate Invite Link
          </button>
          {inviteLink && (
            <div className="mt-2">
              <input
                readOnly
                value={inviteLink}
                className="block w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-800"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>
          )}
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => dialogRef.current?.close()}
            className="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400"
          >
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}
