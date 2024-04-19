"use server";
import { createSupabaseServerClientReadOnly } from "../supabase";

export async function readUserSession() {
	const supabase = await createSupabaseServerClientReadOnly();

	return supabase.auth.getSession();
}
