
/* =========================================
   QUEUELESS REUSABLE COMPONENTS
========================================= */

import { routes, assetUrl } from "./config.js";


/**
 * Generates the shared navigation bar.
 *
 * Every page uses the same navbar component.
 */

export function renderNavbar() {

    return `
        <nav class="navbar" aria-label="Main navigation">

            <div class="container navbar-container">

                <!-- BRAND LOGO -->

                <a href="${routes.home}" class="brand">

                    <img
                        src="${assetUrl("logo/01-queueless-primary-logo.png")}"
                        alt="QueueLess - Don't Wait. Know When to Go."
                        class="brand-logo"
                    >

                </a>


                <!-- DESKTOP NAVIGATION -->

                <div class="nav-menu" id="nav-menu">

                    <a href="${routes.home}"
                       class="nav-link"
                       data-nav="home">
                        Home
                    </a>

                    <a href="${routes.services}"
                       class="nav-link"
                       data-nav="services">
                        Services
                    </a>

                    <a href="${routes.dashboard}"
                       class="nav-link"
                       data-nav="dashboard">
                        Dashboard
                    </a>

                    <a href="${routes.about}"
                       class="nav-link"
                       data-nav="about">
                        About
                    </a>

                    <a href="${routes.services}"
                       class="btn btn-primary nav-cta">
                        Find a Service
                    </a>

                    <a href="${routes.report}" class="nav-link" data-page="report">
    Community Report
</a>

                </div>


                <!-- MOBILE MENU BUTTON -->

                <button
                    class="menu-toggle"
                    id="menu-toggle"
                    type="button"
                    aria-label="Open navigation menu"
                    aria-expanded="false"
                    aria-controls="nav-menu"
                >

                    <span></span>
                    <span></span>
                    <span></span>

                </button>

            </div>

        </nav>
    `;
}


/**
 * Generates the shared application footer.
 */

export function renderFooter() {

    return `

        <div class="footer">

            <div class="container footer-container">

                <div class="footer-brand">

                    <h2>QueueLess</h2>

                    <p>
                        Don't Wait. Know When to Go.
                    </p>

                    <p class="footer-description">
                        Helping people make smarter decisions
                        when accessing essential services.
                    </p>

                </div>


                <div class="footer-column">

                    <h3>Explore</h3>

                    <a href="${routes.home}">Home</a>

                    <a href="${routes.services}">Services</a>

                    <a href="${routes.dashboard}">Dashboard</a>

                </div>


                <div class="footer-column">

                    <h3>Company</h3>

                    <a href="${routes.about}">About QueueLess</a>

                    <a href="${routes.services}">Find a Service</a>

                </div>


            </div>


            <div class="container footer-bottom">

                <p>
                    © ${new Date().getFullYear()} QueueLess.
                    All rights reserved.
                </p>

                <p>
                    Built for smarter service access.
                </p>

            </div>

        </div>

    `;
}
