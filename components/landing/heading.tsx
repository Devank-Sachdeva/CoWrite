import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react"; 

export const Heading = () => {
    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Your Ideas, Documents, & Plans. Unified. Welcome to <span className="underline">CoWrite</span>
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                CoWrite is a connected workspace where <br />
                btter, faster, work happens
            </h3>
            <Button>
                Enter CoWrite 
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
        </div>
    );
}

