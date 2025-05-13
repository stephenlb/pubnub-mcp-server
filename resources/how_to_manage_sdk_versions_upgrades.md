# How to Manage PubNub SDK Versions and Upgrades

PubNub provides a wide range of SDKs (Software Development Kits) for various platforms and programming languages. Keeping your SDKs up-to-date and understanding their lifecycle is important for accessing new features, performance improvements, and security patches.

## PubNub SDK Licensing

*   **Open Source (MIT Licensed):** Most PubNub SDKs are free and open-source, distributed under the permissive MIT license. This allows you to use, modify, and distribute them freely, even in commercial applications.
*   **Check Specific SDK License:** Always verify the license file included with the specific SDK version you are using, as licensing terms could theoretically vary or be updated. PubNub's SDKs are generally hosted on [PubNub's GitHub organization](https://github.com/pubnub/).

## Supported Client Libraries (SDKs)

PubNub officially supports a broad array of SDKs, often quoted as over 70, covering:
*   **Mobile:** iOS (Swift, Objective-C), Android (Java, Kotlin)
*   **Web:** JavaScript (for browsers, Node.js, React, Angular, Vue, etc.)
*   **Desktop:** Java, C#, Python, Ruby, Go, etc.
*   **Server-Side:** SDKs for most popular backend languages.
*   **Embedded/IoT:** C, Python, and others suitable for constrained devices.

*   **Finding SDKs:** The most current list of supported SDKs, along with links to their documentation and GitHub repositories, can always be found on the official [PubNub Documentation website](https://www.pubnub.com/docs) (often under an "SDKs" or "Developers" section).
*   **Community SDKs:** In addition to officially supported SDKs, there might be community-developed libraries. Evaluate these carefully for maintenance status and compatibility.

## When to Upgrade to a Newer SDK Version

1.  **General Recommendation:** It's good practice to use the latest available stable version of the PubNub SDK for your platform. This ensures you have the most recent features, bug fixes, performance enhancements, and security updates.

2.  **Upgrade Cadence:**
    *   **Regular Updates:** Consider checking for and applying minor SDK updates approximately every six months, or align updates with your application's development and release cycles.
    *   **Major Releases:** When PubNub releases a new major version of an SDK (e.g., v4.x.x to v5.x.x), this often indicates significant changes, new features, or potentially breaking API changes. Plan for these upgrades more carefully:
        *   Read the release notes and migration guides thoroughly.
        *   Allocate time for testing to ensure compatibility with your existing codebase.

3.  **Specific Triggers for Upgrading:**
    *   **New Features:** If a new PubNub feature you want to use is only available in a newer SDK version.
    *   **Bug Fixes:** If you encounter a bug that is documented as fixed in a later SDK release.
    *   **Performance Improvements:** Release notes often highlight performance enhancements.
    *   **Security Advisories:** If PubNub issues a security advisory related to an SDK version you are using, upgrade immediately to the patched version.
    *   **Platform Requirements:** If a new version of your operating system, programming language, or framework requires a newer PubNub SDK for compatibility.
    *   **SDK End-of-Life (EOL) Policy:** Be aware of PubNub's SDK EOL policy. Older SDK versions will eventually stop receiving updates and support. Proactively upgrade before an SDK reaches EOL.

## How to Upgrade

1.  **Check for Latest Version:** Visit the PubNub documentation for your specific SDK or its GitHub repository to find the latest stable version number.
2.  **Read Release Notes:** Carefully review the release notes for all versions between your current version and the target version. Pay close attention to:
    *   New features.
    *   Bug fixes.
    *   **Breaking changes** (these will require code modifications).
    *   Deprecated features.
3.  **Update Dependency:** Update the PubNub SDK dependency in your project's package manager (e.g., `npm` for JavaScript, `CocoaPods`/`Swift Package Manager` for iOS, `Gradle` for Android, `pip` for Python, `Maven` for Java, `NuGet` for C#).
4.  **Code Changes (If Necessary):** If there are breaking changes or new API patterns, update your application code accordingly.
5.  **Thorough Testing:** After upgrading, rigorously test all parts of your application that interact with PubNub to ensure everything works as expected. Test publishing, subscribing, presence, history, access management, and any other features you use.

## Staying Informed

*   **Follow GitHub Repositories:** "Watch" the GitHub repositories for the PubNub SDKs you use to get notified of new releases and issues.
*   **PubNub Developer Blog & Community:** Check PubNub's official blog and community forums for announcements about SDK updates and best practices.

By managing your PubNub SDK versions proactively, you can maintain a secure, stable, and feature-rich real-time application. If you need help with an SDK or an upgrade, contact PubNub Support at [support@pubnub.com](mailto:support@pubnub.com).

