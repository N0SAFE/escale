import { ElementsConsumer, PaymentElement } from "@stripe/react-stripe-js";
import { ExpressCheckoutElement } from "@stripe/react-stripe-js";

import React, { FormEventHandler } from "react";

function CheckoutForm(props: { stripe: any; elements: any }) {
    const handleSubmit: FormEventHandler = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        const { stripe, elements } = props;

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const result = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: "https://example.com/order/123/complete"
            }
        });

        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            console.log(result.error.message);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <ExpressCheckoutElement
                onClick={({ resolve }) => {
                    const options = {
                        emailRequired: true
                    };
                    resolve(options);
                }}
                onConfirm={console.log}
                onReady={console.log}
            />
            <PaymentElement onReady={console.log} />
            <button disabled={!props.stripe}>Submit</button>
        </form>
    );
}

// class CheckoutForm extends React.Component {
//     handleSubmit: FormEventHandler = async (event) => {
//         // We don't want to let default form submission happen here,
//         // which would refresh the page.
//         event.preventDefault();

//         const { stripe, elements } = this.props as any

//         if (!stripe || !elements) {
//             // Stripe.js hasn't yet loaded.
//             // Make sure to disable form submission until Stripe.js has loaded.
//             return;
//         }

//         const result = await stripe.confirmPayment({
//             //`Elements` instance that was used to create the Payment Element
//             elements,
//             confirmParams: {
//                 return_url: "https://example.com/order/123/complete"
//             }
//         });

//         if (result.error) {
//             // Show error to your customer (for example, payment details incomplete)
//             console.log(result.error.message);
//         } else {
//             // Your customer will be redirected to your `return_url`. For some payment
//             // methods like iDEAL, your customer will be redirected to an intermediate
//             // site first to authorize the payment, then redirected to the `return_url`.
//         }
//     };

//     render() {
//         return (
//             <form onSubmit={this.handleSubmit}>
//                 <ExpressCheckoutElement
//                     onClick={({ resolve }) => {
//                         const options = {
//                             emailRequired: true
//                         };
//                         resolve(options);
//                     }}
//                     onConfirm={console.log}
//                     onReady={console.log}
//                 />
//                 <PaymentElement onReady={console.log} />
//                 <button disabled={!(this.props as any).stripe}>Submit</button>
//             </form>
//         );
//     }
// }

export default function InjectedCheckoutForm() {
    return <ElementsConsumer>{({ stripe, elements }) => <CheckoutForm stripe={stripe} elements={elements} />}</ElementsConsumer>;
}
