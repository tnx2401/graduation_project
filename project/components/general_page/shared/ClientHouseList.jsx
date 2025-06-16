"use client";
import React, { useEffect, useRef, useState } from "react";
import HouseCard from "../buy_hire/HouseCard";
import Advertisement from "../buy_hire/Advertisement";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Paginate from "./Paginate";

const ITEMS_PER_PAGE = 10;

const ClientHouseList = ({ data, path }) => {
  const uidRef = useRef("");
  const cardRefs = useRef([]);
  const seenPostsRef = useRef(new Set());
  const sendQueue = useRef(new Set());

  const debounceTimeout = useRef(null);
  const BATCH_LIMIT = 5;

  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Set UID from token
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || typeof token !== "string") return;

    try {
      const decoded = jwtDecode(token);
      uidRef.current = decoded.user_id;
    } catch (err) {
      console.error("Token decoding failed:", err);
    }
  }, []);

  const sendSeenPosts = async () => {
    const postsToSend = Array.from(sendQueue.current);
    if (!postsToSend.length) return;

    try {
      await axios.post("/api/handle_posts/batchSeen", {
        userId: uidRef.current,
        postIds: postsToSend,
      });
      postsToSend.forEach((id) => seenPostsRef.current.add(id));
      sendQueue.current.clear();
      console.log("Batch sent:", postsToSend);
    } catch (err) {
      console.error("Batch send failed:", err);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = entry.target.getAttribute("data-index");
          const post = currentData[index];

          if (post?.order === 1 && !seenPostsRef.current.has(post.id)) {
            sendQueue.current.add(post.id);

            if (sendQueue.current.size >= BATCH_LIMIT) {
              if (debounceTimeout.current)
                clearTimeout(debounceTimeout.current);
              sendSeenPosts();
            } else {
              if (debounceTimeout.current)
                clearTimeout(debounceTimeout.current);
              debounceTimeout.current = setTimeout(() => {
                sendSeenPosts();
              }, 1500);
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.2,
      }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [currentData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {currentData.map((item, index) => (
        <React.Fragment key={item.id || index}>
          <div ref={(el) => (cardRefs.current[index] = el)} data-index={index}>
            <HouseCard
              cardData={item}
              path={path}
              hasUid={uidRef.current !== ""}
            />
          </div>
          {index === 1 && <Advertisement path={path} />}
        </React.Fragment>
      ))}

      <Paginate
        totalItems={data.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ClientHouseList;
