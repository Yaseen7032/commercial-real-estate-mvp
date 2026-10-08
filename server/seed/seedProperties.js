const crypto = require("crypto");
const path = require("path");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const connectDB = require("../config/db");
const Property = require("../models/Property");
const User = require("../models/User");

const samplePassword = "LocentraDemo-2026!";
const representatives = [
  { name: "Aarav Mehta", email: "representative1@locentra.demo" },
  { name: "Ananya Rao", email: "representative2@locentra.demo" },
  { name: "Kabir Reddy", email: "representative3@locentra.demo" },
  { name: "Diya Iyer", email: "representative4@locentra.demo" },
  { name: "Ishaan Kulkarni", email: "representative5@locentra.demo" },
];

const sampleProperties = [
  {
    title: "Locentra Demo 01 - Compact High-Street Retail",
    propertyType: "Retail",
    location: "Benz Circle, MG Road",
    city: "Vijayawada",
    areaSqFt: 620,
    monthlyRent: 38000,
    parking: false,
    footTraffic: "High",
    description: "Street-facing shop suited to a boutique, specialty grocer, or service business, with strong evening visibility.",
  },
  {
    title: "Locentra Demo 02 - Corner Retail Studio",
    propertyType: "Retail",
    location: "Labbipet, Mogalrajpuram",
    city: "Vijayawada",
    areaSqFt: 980,
    monthlyRent: 62000,
    parking: true,
    footTraffic: "High",
    description: "Bright corner unit on a busy neighborhood stretch with space for a customer counter and compact back room.",
  },
  {
    title: "Locentra Demo 03 - Neighborhood Office Suite",
    propertyType: "Office",
    location: "Governorpet, Eluru Road",
    city: "Vijayawada",
    areaSqFt: 1450,
    monthlyRent: 72000,
    parking: true,
    footTraffic: "Medium",
    description: "Flexible office floor with a reception area, several work rooms, and convenient access to local transit.",
  },
  {
    title: "Locentra Demo 04 - Small Business Retail Unit",
    propertyType: "Retail",
    location: "Arundelpet, 4th Line",
    city: "Guntur",
    areaSqFt: 760,
    monthlyRent: 32000,
    parking: false,
    footTraffic: "Medium",
    description: "Practical ground-floor unit for a pharmacy, apparel outlet, or local services, close to established shops.",
  },
  {
    title: "Locentra Demo 05 - Guntur Office Floor",
    propertyType: "Office",
    location: "Brodipet, Main Road",
    city: "Guntur",
    areaSqFt: 2100,
    monthlyRent: 89000,
    parking: true,
    footTraffic: "Medium",
    description: "Open-plan commercial floor with room for team seating and meeting space in a well-connected business area.",
  },
  {
    title: "Locentra Demo 06 - Produce and Supply Warehouse",
    propertyType: "Warehouse",
    location: "Autonagar, Industrial Estate",
    city: "Guntur",
    areaSqFt: 6800,
    monthlyRent: 165000,
    parking: true,
    footTraffic: "Low",
    description: "High-clearance storage building with loading access, suitable for regional distribution and wholesale stock.",
  },
  {
    title: "Locentra Demo 07 - Compact Retail Arcade Unit",
    propertyType: "Retail",
    location: "Kukatpally, KPHB Phase 6",
    city: "Hyderabad",
    areaSqFt: 540,
    monthlyRent: 46000,
    parking: true,
    footTraffic: "High",
    description: "Small-format shop in an active residential catchment, suitable for a takeaway counter or personal-care brand.",
  },
  {
    title: "Locentra Demo 08 - Madhapur Office Suite",
    propertyType: "Office",
    location: "Madhapur, Kavuri Hills",
    city: "Hyderabad",
    areaSqFt: 3200,
    monthlyRent: 224000,
    parking: true,
    footTraffic: "Medium",
    description: "Modern fitted office suite with collaborative work area, meeting rooms, and reserved building parking.",
  },
  {
    title: "Locentra Demo 09 - Flexible Mixed-Use Corner",
    propertyType: "Mixed Use",
    location: "Kondapur, Raghavendra Colony",
    city: "Hyderabad",
    areaSqFt: 1850,
    monthlyRent: 118000,
    parking: true,
    footTraffic: "High",
    description: "Ground and mezzanine commercial space suited to a clinic, studio, or customer-facing professional practice.",
  },
  {
    title: "Locentra Demo 10 - Outer-Ring Logistics Shed",
    propertyType: "Industrial",
    location: "Shamshabad, Airport Road",
    city: "Hyderabad",
    areaSqFt: 12400,
    monthlyRent: 310000,
    parking: true,
    footTraffic: "Low",
    description: "Large-format light industrial premises with truck approach and room for storage, assembly, or dispatch operations.",
  },
  {
    title: "Locentra Demo 11 - Neighborhood Shopping Center Unit",
    propertyType: "Shopping Center",
    location: "Gachibowli, Telecom Nagar",
    city: "Hyderabad",
    areaSqFt: 1350,
    monthlyRent: 112000,
    parking: true,
    footTraffic: "High",
    description: "Retail unit in a planned local shopping cluster with shared customer parking and strong weekday activity.",
  },
  {
    title: "Locentra Demo 12 - Commercial Plot near Transit",
    propertyType: "Land",
    location: "Uppal, Nagole Road",
    city: "Hyderabad",
    areaSqFt: 7200,
    monthlyRent: 95000,
    parking: false,
    footTraffic: "Medium",
    description: "Level commercial plot with road frontage for a future neighborhood business or temporary open-air use.",
  },
  {
    title: "Locentra Demo 13 - Seafront District Retail Shop",
    propertyType: "Retail",
    location: "Dwaraka Nagar, 4th Town",
    city: "Visakhapatnam",
    areaSqFt: 890,
    monthlyRent: 54000,
    parking: false,
    footTraffic: "High",
    description: "Visible street-level shop in a busy mixed retail district, suited to fashion, electronics, or daily-use goods.",
  },
  {
    title: "Locentra Demo 14 - Port-City Office Floor",
    propertyType: "Office",
    location: "Siripuram, Waltair Uplands",
    city: "Visakhapatnam",
    areaSqFt: 2600,
    monthlyRent: 132000,
    parking: true,
    footTraffic: "Medium",
    description: "Well-laid-out office floor with lift access and meeting space for a growing professional or logistics team.",
  },
  {
    title: "Locentra Demo 15 - Suburban Retail Showroom",
    propertyType: "Retail",
    location: "Madhurawada, NH-16 Service Road",
    city: "Visakhapatnam",
    areaSqFt: 1750,
    monthlyRent: 87000,
    parking: true,
    footTraffic: "Medium",
    description: "Road-visible showroom with flexible frontage and customer parking, suitable for home, mobility, or lifestyle retail.",
  },
  {
    title: "Locentra Demo 16 - Bengaluru Micro Retail",
    propertyType: "Retail",
    location: "Indiranagar, 12th Main",
    city: "Bengaluru",
    areaSqFt: 480,
    monthlyRent: 58000,
    parking: false,
    footTraffic: "High",
    description: "Compact boutique space on a lively high-street block with visibility for a café counter or specialist retailer.",
  },
  {
    title: "Locentra Demo 17 - Whitefield Office Workspace",
    propertyType: "Office",
    location: "Whitefield, Hoodi Circle",
    city: "Bengaluru",
    areaSqFt: 4200,
    monthlyRent: 273000,
    parking: true,
    footTraffic: "Medium",
    description: "Bright office floor with a mix of open desks and enclosed rooms, positioned near major technology campuses.",
  },
  {
    title: "Locentra Demo 18 - Urban Mixed-Use Studio",
    propertyType: "Mixed Use",
    location: "Jayanagar, 4th Block",
    city: "Bengaluru",
    areaSqFt: 1250,
    monthlyRent: 96000,
    parking: true,
    footTraffic: "High",
    description: "Adaptable commercial unit with a street-level entrance for a design studio, wellness practice, or neighborhood service.",
  },
  {
    title: "Locentra Demo 19 - Perimeter Distribution Warehouse",
    propertyType: "Warehouse",
    location: "Peenya, 2nd Stage",
    city: "Bengaluru",
    areaSqFt: 9600,
    monthlyRent: 288000,
    parking: true,
    footTraffic: "Low",
    description: "Warehouse with loading apron and practical vehicle circulation for city distribution or light assembly.",
  },
  {
    title: "Locentra Demo 20 - Market-Facing Retail Unit",
    propertyType: "Retail",
    location: "T. Nagar, Pondy Bazaar",
    city: "Chennai",
    areaSqFt: 1120,
    monthlyRent: 142000,
    parking: false,
    footTraffic: "High",
    description: "Customer-facing shop in a high-activity shopping district, suitable for apparel, accessories, or specialty retail.",
  },
  {
    title: "Locentra Demo 21 - Guindy Office Suite",
    propertyType: "Office",
    location: "Guindy, GST Road",
    city: "Chennai",
    areaSqFt: 2350,
    monthlyRent: 128000,
    parking: true,
    footTraffic: "Medium",
    description: "Efficient office layout near rail and road links, with a reception zone, enclosed rooms, and shared parking.",
  },
  {
    title: "Locentra Demo 22 - OMR Business Campus Office",
    propertyType: "Office",
    location: "Perungudi, Old Mahabalipuram Road",
    city: "Chennai",
    areaSqFt: 5600,
    monthlyRent: 308000,
    parking: true,
    footTraffic: "Medium",
    description: "Large office floor suited to a technology or business-services team seeking room to scale in the OMR corridor.",
  },
  {
    title: "Locentra Demo 23 - Pune Neighborhood Retail",
    propertyType: "Retail",
    location: "Kothrud, Paud Road",
    city: "Pune",
    areaSqFt: 710,
    monthlyRent: 47000,
    parking: false,
    footTraffic: "High",
    description: "Accessible neighborhood shop surrounded by housing and daily-needs businesses, suited to a compact retail concept.",
  },
  {
    title: "Locentra Demo 24 - Baner Professional Office",
    propertyType: "Office",
    location: "Baner, Pancard Club Road",
    city: "Pune",
    areaSqFt: 2900,
    monthlyRent: 174000,
    parking: true,
    footTraffic: "Medium",
    description: "Flexible office accommodation with natural light and dedicated parking for a professional or consulting firm.",
  },
  {
    title: "Locentra Demo 25 - Pune Fringe Commercial Plot",
    propertyType: "Land",
    location: "Wagholi, Nagar Road",
    city: "Pune",
    areaSqFt: 10800,
    monthlyRent: 78000,
    parking: false,
    footTraffic: "Low",
    description: "Open, road-accessible commercial parcel for a future service hub, storage yard, or phased development.",
  },
  {
    title: "Locentra Demo 26 - Mumbai Compact Business Unit",
    propertyType: "Other",
    location: "Andheri East, Chakala",
    city: "Mumbai",
    areaSqFt: 650,
    monthlyRent: 68000,
    parking: false,
    footTraffic: "Medium",
    description: "Flexible small commercial unit suitable for a service office, repair studio, or appointment-based business.",
  },
  {
    title: "Locentra Demo 27 - Lower Parel Retail Gallery",
    propertyType: "Shopping Center",
    location: "Lower Parel, Senapati Bapat Marg",
    city: "Mumbai",
    areaSqFt: 1580,
    monthlyRent: 196000,
    parking: true,
    footTraffic: "High",
    description: "Retail gallery unit in a mixed commercial district with structured visitor parking and all-day customer activity.",
  },
  {
    title: "Locentra Demo 28 - Navi Mumbai Distribution Space",
    propertyType: "Warehouse",
    location: "Turbhe, MIDC Road",
    city: "Mumbai",
    areaSqFt: 14800,
    monthlyRent: 355000,
    parking: true,
    footTraffic: "Low",
    description: "Broad-span storage premises with vehicle access for last-mile logistics, wholesale inventory, or regional distribution.",
  },
  {
    title: "Locentra Demo 29 - Hyderabad Value Retail Unit",
    propertyType: "Retail",
    location: "Ameerpet, Srinagar Colony Road",
    city: "Hyderabad",
    areaSqFt: 1040,
    monthlyRent: 67000,
    parking: true,
    footTraffic: "High",
    description: "Flexible street-facing retail space near transit and education clusters, with room for a compact stock area.",
  },
  {
    title: "Locentra Demo 30 - Bengaluru Light Industrial Unit",
    propertyType: "Industrial",
    location: "Bommasandra, Jigani Link Road",
    city: "Bengaluru",
    areaSqFt: 7800,
    monthlyRent: 205000,
    parking: true,
    footTraffic: "Low",
    description: "Industrial unit with loading access and practical floor space for light fabrication, packaging, or equipment storage.",
  },
];

function samplePropertyId(index) {
  const id = crypto
    .createHash("sha256")
    .update(`locentra-demo-property-${index + 1}`)
    .digest("hex")
    .slice(0, 24);
  return new mongoose.Types.ObjectId(id);
}

async function ensureRepresentatives() {
  const password = await bcrypt.hash(samplePassword, 12);
  const users = [];
  let createdCount = 0;

  for (const representative of representatives) {
    let user = await User.findOne({ email: representative.email });
    if (user) {
      if (user.role !== "tenantRepresentative") {
        throw new Error(`${representative.email} already exists with a different role.`);
      }
    } else {
      user = await User.create({
        ...representative,
        password,
        role: "tenantRepresentative",
      });
      createdCount += 1;
    }
    users.push(user);
  }

  console.log(
    `Created sample representatives: ${createdCount} created, ${users.length - createdCount} already existed`
  );
  return users;
}

async function seedProperties(users) {
  const properties = sampleProperties.map((property, index) => ({
    ...property,
    imageUrl: `https://placehold.co/1200x800?text=Locentra+Demo+${encodeURIComponent(property.propertyType)}+${encodeURIComponent(property.city)}`,
    representative: users[index % users.length]._id,
    _id: samplePropertyId(index),
  }));

  const existing = await Property.find({
    _id: { $in: properties.map((property) => property._id) },
  }).select("_id title");
  const existingById = new Map(existing.map((property) => [property._id.toString(), property]));
  const toInsert = properties.filter((property) => {
    const found = existingById.get(property._id.toString());
    if (!found) return true;
    if (found.title !== property.title) {
      throw new Error(`Sample property ID collision detected for "${property.title}".`);
    }
    return false;
  });

  if (toInsert.length) {
    await Property.insertMany(toInsert);
  }

  const storedProperties = await Property.find({
    _id: { $in: properties.map((property) => property._id) },
  })
    .populate("representative", "role")
    .lean();

  if (storedProperties.length !== sampleProperties.length) {
    throw new Error(`Expected ${sampleProperties.length} sample properties; found ${storedProperties.length}.`);
  }
  if (
    storedProperties.some(
      (property) => !property.representative || property.representative.role !== "tenantRepresentative"
    )
  ) {
    throw new Error("At least one sample property does not have a valid tenant representative.");
  }

  console.log(`Inserted ${toInsert.length} sample properties (${storedProperties.length} verified total)`);
}

async function main() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");
    const users = await ensureRepresentatives();
    await seedProperties(users);
    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Property seed failed:", error);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      try {
        await mongoose.disconnect();
        console.log("MongoDB connection closed");
      } catch (error) {
        console.error("Failed to close MongoDB connection:", error);
        process.exitCode = 1;
      }
    }
  }
}

main();
