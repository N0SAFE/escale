import ContactForm from "@/components/contact-form";

export default function Contact() {
    async function handleSubmit(data: FormData): Promise<{ state: false; message: string } | { state: true }> {
        "use server";

        try {
            await fetch("/contact", {
                method: "POST",
                body: data
            });
            return {
                state: true
            };
        } catch (e: any) {
            return {
                state: false,
                message: e?.data?.message || "Une erreur est survenue"
            };
        }
    }
    return <ContactForm onSubmit={handleSubmit} />;
}
