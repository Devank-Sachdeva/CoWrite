import { NavBar } from "@/components/landing/navbar";

const LandingLayout = ({children} : {children: React.ReactNode}) => {
    return (
        <div className="h-full dark:bg-[#1F1F1F]">
            <NavBar />
            <main className="h-full pt-28">
                {children}
            </main>
        </div>
    );
}

export default LandingLayout;