"use client";
import { jsPDF } from "jspdf";
import SaveAsPDFButton from "./SaveAsPDFButton";

export default function PuppyAppPDFDownload({ data }: { data: any }) {
  const handlePDFDownload = () => {
    if (!data) return;
    const doc = new jsPDF();
    doc.text(`Puppy Application for ${data.name}`, 10, 10);
    doc.text(`Email: ${data.email}`, 10, 20);
    doc.text(`City: ${data.city}`, 10, 30);
    doc.text(`State: ${data.state}`, 10, 40);
    doc.text(`Zip: ${data.zip}`, 10, 50);
    doc.text(`Age: ${data.age}`, 10, 60);
    doc.text(`Pets Owned: ${data.petsOwned}`, 10, 70);
    doc.text(`Has Children: ${data.hasChildren ? "Yes" : "No"}`, 10, 80);
    doc.text(`Puppy Preference: ${data.puppyPreference}`, 10, 90);
    doc.text(`Gender Preference: ${data.genderPreference}`, 10, 100);
    doc.text(`Training Planned: ${data.trainingPlanned ? "Yes" : "No"}`, 10, 110);
    doc.text(`Desired Traits: ${data.desiredTraits}`, 10, 120);
    doc.text(`Additional Comments: ${data.additionalComments}`, 10, 130);
    doc.save(`puppy-application-${data.name}.pdf`);
  };

  return <SaveAsPDFButton onClick={handlePDFDownload}  />;
}