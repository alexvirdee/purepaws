import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function TermsAndConditionsDialog({
    onAccept,
    termsAccepted,
}: {
    onAccept: () => void;
    termsAccepted: boolean;
}) {
    return (
        <>
            <Label className="block mb-1 font-medium">Terms and Conditions*</Label>
            <Dialog>

                <DialogTrigger asChild>
                    <Button variant="outline">{termsAccepted ? "Terms Accepted" : "Accept Terms & Conditions"}</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Terms and Conditions Policy</DialogTitle>
                        <DialogDescription>
                            Please read our terms and conditions carefully before submitting your application.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto text-sm text-gray-700">
                        <p>
                            By submitting this breeder application, you agree to comply with all terms
                            and conditions outlined below:
                        </p>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>
                                You confirm that all information provided in this application is true and
                                accurate to the best of your knowledge.
                            </li>
                            <li>
                                You agree to uphold ethical breeding practices and comply with all local,
                                state, and federal regulations regarding animal welfare.
                            </li>
                            <li>
                                You grant us the right to review, verify, and approve or reject your
                                application at our sole discretion.
                            </li>
                            <li>
                                You understand that failure to meet our requirements may result in
                                rejection or removal from our breeder directory.
                            </li>
                            <li>
                                You agree to keep your information up-to-date and notify us of any
                                significant changes to your breeding operations.
                            </li>
                        </ol>
                        <p>
                            If you have any questions about these terms, please contact us at
                            woofpurepaws@gmail.com before proceeding.
                        </p>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={onAccept}>Accept & Continue</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>

            </Dialog>
        </>
    );
}