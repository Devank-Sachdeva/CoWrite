import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon, MenuSquareIcon, Sidebar } from "lucide-react"
import { usePathname } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react"
import { useMediaQuery } from "usehooks-ts";

export const SideBar = () => {
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const isResizingRef = useRef(false);
    const sideBarRef = useRef<ElementRef<"aside">>(null);
    const navBarRef = useRef<ElementRef<"div">>(null);
    const [ isReseting, setIsReseting ] = useState(false);
    const [ isCollapsed, setIsCollapsed ] = useState(isMobile);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("mouse down")
        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizingRef.current) return;
        let newWidth = e.clientX;

        if (newWidth < 240) newWidth = 240;
        if (newWidth > 480) newWidth = 480;

        if (sideBarRef.current && navBarRef.current) {
            sideBarRef.current.style.width = `${newWidth}px`;
            navBarRef.current.style.setProperty("left", `${newWidth}px`);
            navBarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
        }
    }

    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }

    const resetWidth = () => {
        if (sideBarRef.current && navBarRef.current) {
            setIsReseting(true);
            setIsCollapsed(false);
            sideBarRef.current.style.width = isMobile? "100%" : "240px";
            navBarRef.current.style.setProperty("left",isMobile ? "0" : "240px");
            navBarRef.current.style.setProperty("width", isMobile ? "0": "calc(100% - 240px)");

            setTimeout(()=> setIsReseting(false), 300);
        }
    }

    const collapse = () => {
        if (sideBarRef.current && navBarRef.current) {
            setIsCollapsed(true);
            setIsReseting(true);
            sideBarRef.current.style.width = "0";
            navBarRef.current.style.setProperty("left", "0");
            navBarRef.current.style.setProperty("width", "100%");
            setTimeout(()=> setIsReseting(false), 300);
        
        }
    }

    useEffect(() => {
        if (isMobile) collapse();
        else resetWidth();
    }, [isMobile, resetWidth]);

    useEffect(() => {
        if (isMobile) collapse();

    }, [isMobile, pathname])
    
    return (
        <>
        <aside 
            ref={sideBarRef} 
            className={cn(
                "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]", 
                isReseting && "transition-all ease-in-out duration-300 ",
                isMobile && "w-0"
            )}
        >
            <div 
                role="button"
                onClick={collapse}
                className={cn(
                    "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                    isMobile && "opacity-100"
                    )} >
                    <ChevronsLeft className="h-6 w-6" />
            </div>
            <div>
                <p>Action Items</p>
            </div>
            <div className="mt-4">
                <p>Documents</p>
            </div>
                <div className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0" onMouseDown={handleMouseDown} onClick={resetWidth} />

        </aside>
        <div ref={navBarRef} className={cn("absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
            isReseting && "transition-all ease-in-out duration-300",
            isMobile && "left-0 w-full"
        
        )}>
            <nav className="bg-transparent px-3 py-2 w-full">
                {isCollapsed && <MenuSquareIcon className="h-6 w-6 text-muted-foreground " role="button" onClick={resetWidth}/>}
            </nav>
        </div>
        </>
    )
}