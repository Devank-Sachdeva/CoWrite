import { Footer } from "@/components/landing/footer";
import { Heading } from "@/components/landing/heading";
import { Heroes } from "@/components/landing/heroes"


export default function LandingPage() {
    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
            <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
                <Heading />
                <Heroes />
            </div>
            <Footer />
        </div>
    );
}