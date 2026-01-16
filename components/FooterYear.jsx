const FooterYear = () => {
    return (
        <footer className="footer sm:footer-horizontal footer-center bg-purple-700 text-base-content p-3">
            <aside>
                <p>
                    Copyright © {new Date().getFullYear()} - All right reserved by
                    Nexoro Solutions
                </p>
            </aside>
        </footer>
    )
}

export default FooterYear