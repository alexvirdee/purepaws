"use client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import SaveAsPDFButton from "./SaveAsPDFButton";

export default function PuppyAppPDFDownload({ data }: { data: any }) {
    const handlePDFDownload = () => {
        if (!data) return;

        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text(`Puppy Application`, 14, 20);
        doc.setFontSize(12);
        doc.text(`Applicant: ${data.name}`, 14, 28);
        doc.text(`Email: ${data.email}`, 14, 35);

        autoTable(doc, {
            startY: 45,
            head: [['Field', 'Response']],
            body: [
                ['City', data.city],
                ['State', data.state],
                ['Zip', data.zip],
                ['Age', data.age],
                ['Pets Owned', data.petsOwned],
                ['Has Children', data.hasChildren ? 'Yes' : 'No'],
                ['Puppy Preference', data.puppyPreference],
                ['Gender Preference', data.genderPreference],
                ['Training Planned', data.trainingPlanned ? 'Yes' : 'No'],
                ['Desired Traits', data.desiredTraits],
                ['Additional Comments', data.additionalComments || '—'],
            ],
            styles: {
                cellPadding: 3,
                fontSize: 10,
                valign: 'middle',
            },
            headStyles: {
                fillColor: [220, 220, 220],
                textColor: 20,
                fontStyle: 'bold',
            },
        });

        doc.save(`puppy-application-${data.name}.pdf`);
    };

    return <SaveAsPDFButton onClick={handlePDFDownload} />;
}