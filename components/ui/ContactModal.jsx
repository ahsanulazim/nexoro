'use client'

import { FaEnvelopeCircleCheck, FaXmark } from "react-icons/fa6"

const ContactModal = ({ ref }) => {
    return (
        <dialog ref={ref} id="my_modal_1" className="modal">
            <div className="modal-box flex items-center flex-col relative">
                <FaEnvelopeCircleCheck className="text-8xl text-success" />
                <p className="py-4">
                    Thank you for showing interest in Nexoro Solutions. You&apos;ll be
                    contacted by us very soon.
                </p>
                <div className="modal-action absolute top-0 right-5">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-soft btn-square">
                            <FaXmark />
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

export default ContactModal
