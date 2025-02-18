import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"
import Image from "next/image"

const font = Poppins({
    subsets: ['latin'],
    weight: ["400", "600"]
})

export const Logo = () => {
    return (
        <div className="hidden md:flex items-center gap-x-2">
            <Image
                src={"/logo.svg"}
                alt="logo"
                height={40}
                width={40} 
                className="dark:hidden"
            />
            <Image
                src={"/logo-dark.svg"}
                alt="logo"
                height={40}
                width={40} 
                className="hidden dark:flex"
            />
            <p className={cn("font-semibold", font.className, "text-xl")} >
                CoWrite
            </p>
        </div>
    )
}