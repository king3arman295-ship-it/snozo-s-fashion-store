const express = require("express")
const router = express.Router()

const Order = require("../models/Order")
const nodemailer = require("nodemailer")

// =========================
// EMAIL TRANSPORTER
// =========================
const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }

})

// =========================
// PLACE ORDER
// =========================
router.post("/", async (req, res) => {

    try {

        // =========================
        // SAFE CART ITEMS
        // =========================
        const cartItems = Array.isArray(req.body.cartItems)

            ? req.body.cartItems.map(item => ({

                name: item?.name || "Item",

                price: Number(
                    String(item?.price || 0)
                        .replace("Rs", "")
                        .replace("$", "")
                        .trim()
                ),

                quantity: item?.quantity
                    ? Number(item.quantity)
                    : 1,

                image: item?.image || ""

            }))

            : []

        // =========================
        // ITEMS HTML
        // =========================
        const itemsHTML = cartItems.map(item => `

            <li>
                ${item.name}
                × ${item.quantity}
                — Rs ${item.price}
            </li>

        `).join("")

        // =========================
        // CREATE ORDER
        // =========================
        const newOrder = new Order({

            user: req.body.user || null,

            customerName: req.body.customerName,

            email: req.body.email,

            address: req.body.address,

            phone: req.body.phone,

            cartItems: cartItems,

            totalPrice: req.body.totalPrice,

            paymentMethod:
                req.body.paymentMethod || "cod",

            transactionId:
                req.body.transactionId || "",

            status: "Pending"

        })

        await newOrder.save()

        // =========================
        // CUSTOMER EMAIL
        // =========================
        try {

            await transporter.sendMail({

                from: process.env.EMAIL_USER,

                to: req.body.email,

                subject:
                    "Order Confirmation - Snozo's Fashion Store",

                html: `

                    <h2>
                        Thank you for your order!
                    </h2>

                    <p>
                        Hello ${req.body.customerName || "Customer"},
                    </p>

                    <p>
                        Your order has been placed successfully.
                    </p>

                    <h3>Order Details:</h3>

                    <ul>
                        ${itemsHTML}
                    </ul>

                    <h3>
                        Total: Rs ${req.body.totalPrice || 0}
                    </h3>

                    <p>
                        Payment Method:
                        ${req.body.paymentMethod || "cod"}
                    </p>

                    <p>
                        Status: Pending
                    </p>

                    <br/>

                    <p>
                        Snozo's Fashion Store
                    </p>

                `

            })

            console.log("Customer email sent ✔")

        } catch (emailErr) {

            console.log(
                "Customer email failed:",
                emailErr.message
            )

        }

        // =========================
        // ADMIN EMAIL
        // =========================
        try {

            if (process.env.ADMIN_EMAIL) {

                await transporter.sendMail({

                    from: process.env.EMAIL_USER,

                    to: process.env.ADMIN_EMAIL,

                    subject: "🛒 New Order Received",

                    html: `

                        <h2>
                            New Order Received
                        </h2>

                        <p>
                            <b>Name:</b>
                            ${req.body.customerName}
                        </p>

                        <p>
                            <b>Email:</b>
                            ${req.body.email}
                        </p>

                        <p>
                            <b>Phone:</b>
                            ${req.body.phone}
                        </p>

                        <p>
                            <b>Address:</b>
                            ${req.body.address}
                        </p>

                        <p>
                            <b>Payment:</b>
                            ${req.body.paymentMethod || "cod"}
                        </p>

                        <h3>Items:</h3>

                        <ul>
                            ${itemsHTML}
                        </ul>

                        <h3>
                            Total:
                            Rs ${req.body.totalPrice}
                        </h3>

                        <p>
                            Status: Pending
                        </p>

                    `

                })

                console.log("Admin email sent ✔")

            } else {

                console.log(
                    "ADMIN_EMAIL missing in .env"
                )

            }

        } catch (adminErr) {

            console.log(
                "Admin email failed:",
                adminErr.message
            )

        }

        // =========================
        // RESPONSE
        // =========================
        res.status(201).json({

            message:
                "Order placed successfully",

            order: newOrder

        })

    } catch (err) {

        console.log("ORDER ERROR:", err)

        res.status(500).json({

            message:
                "Failed to place order"

        })

    }

})

// =========================
// GET ALL ORDERS
// =========================
router.get("/", async (req, res) => {

    try {

        const orders = await Order.find()
            .sort({ createdAt: -1 })

        res.json(orders)

    } catch (err) {

        console.log(err)

        res.status(500).json({

            message:
                "Failed to fetch orders"

        })

    }

})

// =========================
// GET USER ORDERS
// =========================
router.get("/user/:userId", async (req, res) => {

    try {

        const orders = await Order.find({

            user: req.params.userId

        }).sort({ createdAt: -1 })

        res.json(orders)

    } catch (err) {

        console.log(err)

        res.status(500).json({

            message:
                "Failed to fetch user orders"

        })

    }

})

// =========================
// UPDATE ORDER STATUS
// =========================
router.put("/:id", async (req, res) => {

    try {

        const updatedOrder =
            await Order.findByIdAndUpdate(

                req.params.id,

                {
                    status: req.body.status
                },

                {
                    new: true
                }

            )

        res.json(updatedOrder)

    } catch (err) {

        console.log(err)

        res.status(500).json({

            message:
                "Failed to update order"

        })

    }

})

// =========================
// DELETE ORDER
// =========================
router.delete("/:id", async (req, res) => {

    try {

        await Order.findByIdAndDelete(
            req.params.id
        )

        res.json({

            message:
                "Order deleted"

        })

    } catch (err) {

        console.log(err)

        res.status(500).json({

            message:
                "Delete failed"

        })

    }

})

module.exports = router