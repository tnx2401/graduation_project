"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import locationData from "@/public/local.json";
import useStore from "@/lib/zustand";
import pathConfig from "../shared/pathConfig";
import pathFunction from "../shared/pathFunction";

const Title = ({ amount }) => {
  const path = usePathname();
  const {
    g_province,
    g_district,
    g_ward,
    g_street,
    g_setProvince,
    g_setDistrict,
    g_setWard,
    g_setStreet,
    g_setSearchQuery,
  } = useStore();

  const [title, setTitle] = useState("");
  const [link, setLink] = useState([]);
  const [lookingFor, setLookingFor] = useState("");
  const [locationArr, setLocationArr] = useState([]);

  //* So sánh tên đường,phường,quận,tỉnh/thành với path
  const extractMatch = (slug, name) => {
    const slugName = pathFunction.convertToSlug(name);

    const pattern = new RegExp(`(?:^|-)(${slugName})(?=-|$)`);
    const match = slug.match(pattern);

    if (match) {
      return match[1];
    }

    return null;
  };
  const locationMap = useRef(new Map());

  //* Tìm địa chỉ
  locationData.forEach((province) => {
    if (
      pathFunction.convertToSlug(province.name) ===
      pathFunction.convertToSlug(g_province)
    ) {
      province.districts.forEach((district) => {
        if (
          (lookingFor === "quan" || lookingFor === "huyen") &&
          district.name === g_district &&
          province.name === g_province
        ) {
          const matchedDistrict = extractMatch(path, district.name);
          if (matchedDistrict) {
            locationMap.current.set(district.id, {
              id: district.id,
              prefix: district.prefix,
              name: district.name,
            });
          }
        }

        district.wards.forEach((ward) => {
          if (
            (lookingFor === "phuong" || lookingFor === "xa") &&
            ward.name === g_ward
          ) {
            const matchedWard = extractMatch(path, ward.name);
            if (matchedWard) {
              locationMap.current.set(ward.id, {
                id: ward.id,
                prefix: ward.prefix,
                name: ward.name,
              });
            }
          }

          district.streets.forEach((street) => {
            if (
              (lookingFor === "duong" || lookingFor === "pho") &&
              street.name === g_street &&
              district.name === g_district
            ) {
              const matchedStreet = extractMatch(path, street.name);
              if (matchedStreet) {
                locationMap.current.set(street.id, {
                  id: street.id,
                  prefix: street.prefix,
                  name: street.name,
                });
              }
            }
          });
        });
      });
    }
  });

  const newLocationArr = Array.from(locationMap.current.values());

  if (JSON.stringify(newLocationArr) !== JSON.stringify(locationArr)) {
    setLocationArr(newLocationArr);
  }

  useEffect(() => {
    let newLink = [];
    let basePath = pathFunction.getBasePath(path);

    if (path.includes("ban")) {
      newLink.push({
        name: "Bán",
        path: "/nha-dat-ban",
        style: "text-neutral-400",
      });
    } else if (path.includes("thue")) {
      newLink.push({
        name: "Thuê",
        path: "/nha-dat-cho-thue",
        style: "text-neutral-400",
      });
    }

    if (g_province) {
      newLink.push({
        name: g_province,
        path: basePath + "-" + pathFunction.convertToSlug(g_province),
      });
    }

    if (g_district) {
      newLink.push({
        name: g_district,
        path:
          basePath +
          "-" +
          lookingFor +
          "-" +
          pathFunction.convertToSlug(g_district),
      });
    }

    if (basePath) {
      const location = locationArr[0];

      let locationDescription = "";
      let pathDescription = "";

      if (
        lookingFor === "duong" ||
        lookingFor === "pho" ||
        lookingFor === "phuong" ||
        lookingFor === "xa"
      ) {
        locationDescription = `tại ${location.prefix} ${location.name}, ${
          isNaN(g_district.split(" ").splice(1).join(" "))
            ? "Quận " + g_district
            : g_district
        }, ${g_province}`;
        pathDescription = `-${pathFunction.convertToSlug(
          location.prefix
        )}-${pathFunction.convertToSlug(location.name)}`;
      } else if (lookingFor === "quan" || lookingFor === "huyen") {
        locationDescription = `tại ${
          location.name.startsWith("Quận") || location.name.startsWith("Huyện")
            ? location.name
            : "Quận " + location.name
        }`;
        pathDescription = `-${lookingFor}-${pathFunction.convertToSlug(
          location.name
        )}`;
      } else if (g_province !== "") {
        locationDescription = `tại ${g_province}`;
        pathDescription = `-${pathFunction.convertToSlug(g_province)}`;
      } else {
        locationDescription = `trên toàn quốc`;
        pathDescription = ``;
      }

      setTitle(pathConfig[basePath].title + " " + locationDescription);
      const conditionalLink = {
        name: pathConfig[basePath].links[0].name + " " + locationDescription,
        path: pathConfig[basePath].links[0].path + pathDescription,
      };
      newLink.push(conditionalLink);
    } else {
      setTitle("");
    }
    setLink(newLink);
    setLookingFor(path.slice(basePath.length + 1).split("-")[0]);
  }, [path, locationArr]);

  const handleResetPath = (name) => {
    if (name === "Bán" || name === "Thuê") {
      g_setDistrict("");
      g_setProvince("");
      g_setWard("");
      g_setStreet("");
    }
    if (name === g_province) {
      g_setDistrict("");
      g_setWard("");
      g_setStreet("");
    }
  };

  return (
    <div>
      <div className="flex gap-1 mt-5">
        {link.map((item, index) => (
          <div
            key={index}
            className="text-sm"
            onClick={() => handleResetPath(item.name)}
          >
            <Link
              href={item.path}
              className={`${item.style}`}
              onClick={() => {
                g_setSearchQuery({
                  demand: "Tìm mua",
                  type: [],
                  address: [],
                  price: "",
                  area: "",
                  bedroom: "",
                  houseDirection: [],
                  balconyDirection: [],
                });
              }}
            >
              {item.name}
            </Link>
            {index < link.length - 1 ? <span className="ml-1">/</span> : null}
          </div>
        ))}
      </div>
      <h1 className="text-2xl mt-2">{title}</h1>
      <p className="text-sm mt-2 text-neutral-600">
        Hiện có {amount} bất động sản
      </p>
    </div>
  );
};

export default Title;
