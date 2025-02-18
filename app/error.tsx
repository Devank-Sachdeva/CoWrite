"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
const Error = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="/error.png"
                height={300}
                width={300}
                alt="Error"
                className="dark:hidden"
            />
            <Image
                src="/error-dark.png"
                height={300}
                width={300}
                alt="Error"
                className="hidden dark:block"
            />
            <h2 className="text-xl font-medium mb-7">
                Something went wrong!
            </h2>
            <Button asChild>
                <Link href={"/documents"}>
                    Go Back
                </Link>
            </Button>
        </div>
    );
};

export default Error;
