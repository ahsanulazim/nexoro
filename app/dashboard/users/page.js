"use client";

import { fetchUsers, getMembers } from "@/api/fetchUsers";
import DashBread from "@/components/dashboard/DashBread";
import UserNav from "@/components/dashboard/users/UserNav";
import UserTable from "@/components/dashboard/users/UserTable";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthProvider";
import { auth } from "@/firebase/firebase.config";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { LuIdCard, LuShieldCheck, LuStore, LuUsers } from "react-icons/lu";

const UsersPage = () => {
  const [user, authLoading] = useAuthState(auth);
  const { currentUser } = useAuth();
  const router = useRouter();

  // Filter & Search states
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleRoleChange = (role) => {
    setFilterRole(role);
    setCurrentPage(1);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  // Fetch customers
  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["users", user?.uid],
    queryFn: fetchUsers,
    enabled: !!user,
  });

  // Fetch team members
  const {
    data: members = [],
    isLoading: membersLoading,
    isError: membersError,
  } = useQuery({
    queryKey: ["members", user?.uid],
    queryFn: getMembers,
    enabled: !!user,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Merge and normalize users & members
  const combinedUsers = useMemo(() => {
    const list = [];
    const seenEmails = new Set();

    // Add members first
    if (Array.isArray(members)) {
      members.forEach((m) => {
        if (m?.email && !seenEmails.has(m.email.toLowerCase())) {
          seenEmails.add(m.email.toLowerCase());
          list.push({
            ...m,
            role: m.role || "member",
          });
        }
      });
    }

    // Add customers
    if (Array.isArray(users)) {
      users.forEach((u) => {
        if (u?.email && !seenEmails.has(u.email.toLowerCase())) {
          seenEmails.add(u.email.toLowerCase());
          list.push({
            ...u,
            role: u.role || "customer",
          });
        }
      });
    }

    return list;
  }, [users, members]);

  // Counts for role tabs & stat cards
  const counts = useMemo(() => {
    let customerCount = 0;
    let memberCount = 0;
    let adminCount = 0;

    combinedUsers.forEach((u) => {
      const r = (u.role || "customer").toLowerCase();
      if (r === "admin") adminCount++;
      else if (r === "member") memberCount++;
      else customerCount++;
    });

    return {
      all: combinedUsers.length,
      customer: customerCount,
      member: memberCount,
      admin: adminCount,
    };
  }, [combinedUsers]);

  // Filter and Sort the combined list
  const filteredUsers = useMemo(() => {
    let result = [...combinedUsers];

    // 1. Role filter
    if (filterRole !== "all") {
      result = result.filter(
        (u) =>
          (u.role || "customer").toLowerCase() === filterRole.toLowerCase(),
      );
    }

    // 2. Search filter (Name or Email)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((u) => {
        const name = (u.name || u.userName || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        return name.includes(q) || email.includes(q);
      });
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === "date_asc") {
        const dateA = a.createdAt ? moment(a.createdAt).valueOf() : 0;
        const dateB = b.createdAt ? moment(b.createdAt).valueOf() : 0;
        return dateA - dateB;
      }
      if (sortBy === "name_asc") {
        const nameA = (a.name || a.userName || "").toLowerCase();
        const nameB = (b.name || b.userName || "").toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "name_desc") {
        const nameA = (a.name || a.userName || "").toLowerCase();
        const nameB = (b.name || b.userName || "").toLowerCase();
        return nameB.localeCompare(nameA);
      }
      // Default: date_desc
      const dateA = a.createdAt ? moment(a.createdAt).valueOf() : 0;
      const dateB = b.createdAt ? moment(b.createdAt).valueOf() : 0;
      return dateB - dateA;
    });

    return result;
  }, [combinedUsers, filterRole, searchTerm, sortBy]);

  const handleResetFilters = () => {
    setFilterRole("all");
    setSearchTerm("");
    setSortBy("date_desc");
    setCurrentPage(1);
  };

  if (authLoading || usersLoading || membersLoading) {
    return <Loader />;
  }

  if (currentUser?.user?.role !== "admin" || (usersError && membersError)) {
    router.push("/dashboard");
    return null;
  }

  return (
    <main className="space-y-6 pb-12">
      {/* Top Header */}
      <section>
        <DashBread title="Users" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3">
              <LuUsers className="text-primary size-8" /> Users Management
            </h1>
            <p className="text-sm opacity-60 mt-1">
              Manage all registered customers, team members, roles, and
              permissions.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Users */}
        <div className="bg-base-100 p-4 rounded-box border border-base-200/80 shadow-xs flex items-center gap-4">
          <div className="size-12 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <LuUsers className="size-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-base-content/60 font-medium">
              Total Users
            </div>
            <div className="text-2xl font-bold text-base-content mt-0.5">
              {counts.all}
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-base-100 p-4 rounded-box border border-base-200/80 shadow-xs flex items-center gap-4">
          <div className="size-12 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <LuStore className="size-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-base-content/60 font-medium">
              Customers
            </div>
            <div className="text-2xl font-bold text-base-content mt-0.5">
              {counts.customer}
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-base-100 p-4 rounded-box border border-base-200/80 shadow-xs flex items-center gap-4">
          <div className="size-12 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <LuIdCard className="size-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-base-content/60 font-medium">
              Team Members
            </div>
            <div className="text-2xl font-bold text-base-content mt-0.5">
              {counts.member}
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Navigation */}
      <section>
        <UserNav
          filterRole={filterRole}
          setFilterRole={handleRoleChange}
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          sortBy={sortBy}
          setSortBy={handleSortChange}
          counts={counts}
        />
      </section>

      {/* Unified User Table */}
      <section>
        <UserTable
          users={filteredUsers}
          isLoading={usersLoading || membersLoading}
          isError={usersError && membersError}
          searchTerm={searchTerm}
          filterRole={filterRole}
          onResetFilters={handleResetFilters}
          currentLoggedInEmail={user?.email}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </section>
    </main>
  );
};

export default UsersPage;
