import type { NoteTone } from "./noteTone";

export type NoteBlockData = {
    title: string;
    body: string;
    tone?: NoteTone;
};

export function composeNoteBlocks(...groups: Array<NoteBlockData | null | undefined>) {
    return groups.filter((group): group is NoteBlockData => Boolean(group?.body));
}

