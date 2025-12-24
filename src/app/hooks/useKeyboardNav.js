'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { globalShortcuts, sidebarConfig } from "@/components/experimental";

export default function useKeyboardNav() {
    const router = useRouter();
    useEffect(() => {
        //create lookup map once O(1) access
        const navMap = new Map(
            sidebarConfig.map(item => [item.key, item])
        )

        globalShortcuts.forEach(shortcut => {
            navMap.set(shortcut.key, shortcut);
        });

        const handleKeyDown = (event) => {
            //check if the user is typing in an input field
            const targetTag = event.target.tagName;
            const isTyping = targetTag === 'INPUT' ||
                            targetTag === 'TEXTAREA' ||
                            event.target.contentEditable === 'true';
            if (isTyping) return; //dont nav if typing
            //make the key uppercase
            const key = event.key.toUpperCase();
            //constant look up time.
            const navItem = navMap.get(key);
            if (navItem) {
                event.preventDefault();
                router.push(navItem.href); 
            }
        };
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);
}
