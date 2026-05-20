export default function PageHeader() {
    return (
    <>
        {location.pathname === "/dashboard" && (
        <div id="pageheader-container" className="flex items-center justify-between p-4">
            <div id="pageheader-left" className="flex flex-col">
                <span id="page-title" className="text-3xl font-semibold">
                    Dashboard
                </span>
                <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-2">
                    <span id="breadcrumb-home" className="text-gray-500">Dashboard</span>
                    <span id="breadcrumb-separator" className="text-gray-500">/</span>
                    <span id="breadcrumb-current" className="text-gray-500">Order List</span>
                </div>
            </div>
        </div>
    )}

        {location.pathname === "/inventory" && (
            <div id="pageheader-container" className="flex items-center justify-between p-4">
            <div id="pageheader-left" className="flex flex-col">
                <span id="page-title" className="text-3xl font-semibold">
                    Inventory
                </span>
                <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-2">
                    <span id="breadcrumb-home" className="text-gray-500"></span>
                    <span id="breadcrumb-separator" className="text-gray-500">/</span>
                    <span id="breadcrumb-current" className="text-gray-500"></span>
                </div>
            </div>
        </div>
    )}
        {location.pathname === "/reports" && (
            <div id="pageheader-container" className="flex items-center justify-between p-4">
                <div id="pageheader-left" className="flex flex-col">
                    <span id="page-title" className="text-3xl font-semibold">
                        Reports
                    </span>
                    <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-2">
                        <span id="breadcrumb-home" className="text-gray-500"></span>
                        <span id="breadcrumb-separator" className="text-gray-500">/</span>
                        <span id="breadcrumb-current" className="text-gray-500"></span>
                    </div>
                </div>
            </div>    
    )}
        {location.pathname === "/suppliers" && (
            <div id="pageheader-container" className="flex items-center justify-between p-4">
            <div id="pageheader-left" className="flex flex-col">
                <span id="page-title" className="text-3xl font-semibold">
                    Suppliers
                </span>
                <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-2">
                    <span id="breadcrumb-home" className="text-gray-500"></span>
                    <span id="breadcrumb-separator" className="text-gray-500">/</span>
                    <span id="breadcrumb-current" className="text-gray-500"></span>
                </div>
            </div>
        </div>
    )}
        {location.pathname === "/orders" && (
            <div id="pageheader-container" className="flex items-center justify-between p-4">
            <div id="pageheader-left" className="flex flex-col">
                <span id="page-title" className="text-3xl font-semibold">
                    Orders
                </span>
                <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-2">
                    <span id="breadcrumb-home" className="text-gray-500"></span>
                    <span id="breadcrumb-separator" className="text-gray-500">/</span>
                    <span id="breadcrumb-current" className="text-gray-500"></span>
                </div>
            </div>
        </div>
    )}
        {location.pathname === "/manage-store" && (
            <div id="pageheader-container" className="flex items-center justify-between p-4">
            <div id="pageheader-left" className="flex flex-col">
                <span id="page-title" className="text-3xl font-semibold">
                    Manage Store
                </span>
                <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-2">
                    <span id="breadcrumb-home" className="text-gray-500"></span>
                    <span id="breadcrumb-separator" className="text-gray-500">/</span>
                    <span id="breadcrumb-current" className="text-gray-500"></span>
                </div>
            </div>
        </div>
    )}
        {location.pathname === "/settings" && (
            <div id="pageheader-container" className="flex items-center justify-between p-4">
            <div id="pageheader-left" className="flex flex-col">
                <span id="page-title" className="text-3xl font-semibold">
                    Settings
                </span>
                <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-2">
                    <span id="breadcrumb-home" className="text-gray-500"></span>
                    <span id="breadcrumb-separator" className="text-gray-500">/</span>
                    <span id="breadcrumb-current" className="text-gray-500"></span>
                </div>
            </div>
        </div>    
        )}
    </>
    );
}