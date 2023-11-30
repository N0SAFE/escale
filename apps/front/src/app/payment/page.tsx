"use client";

import InjectedCheckoutForm from "@/components/stripe/CheckoutForm";
import Navbar from "@/components/stripe/Navbar";
import { Elements } from "@stripe/react-stripe-js";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

function Payment() {
    const [stripePromise, setStripePromise] = useState<null | Stripe>(null);
    useEffect(() => {
        async function load() {
            setStripePromise(await loadStripe("pk_test_51LbNwyAsJmdOM7Vkrxp1lUOF5yh2V9HHVaa8Dc3cyDXifwmGYXRjtUCWiEzyTOMqTxtFgEO3KewkUWUyppi5x1QB00E9vCkwu2"));
        }
        load();
    }, []);

    const options = {
        // passing the client secret obtained from the server
        clientSecret: "pi_3OHuhmAsJmdOM7Vk1ZkokAzI_secret_8zBHjjFXQx9NogXBtt81njmZ2"
    };

    return (
        <div style={{ height: "100vh" }}>
            <Navbar
                links={[
                    {
                        label: "acceuil",
                        link: "/"
                    },
                    {
                        label: "reservation",
                        link: "/reservation"
                    },
                    {
                        label: "contact",
                        link: "/contact"
                    },
                    {
                        label: "faq",
                        link: "/faq"
                    },
                    {
                        label: "reglement interieur",
                        link: "/reglement-interieur"
                    }
                ]}
            />
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    backgroundColor: "#f5f5f5"
                }}
            >
                <Elements stripe={stripePromise} options={options}>
                    <InjectedCheckoutForm />
                </Elements>
            </div>
        </div>
    );
}

export default Payment;
