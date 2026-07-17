"""
Command-line interface for common backend tasks.

Usage:
    python -m cli seed [--confirm]     # Seed database with demo data
    python -m cli health               # Check database connection
"""

from __future__ import annotations

import argparse
import asyncio
import sys

from app.core.config import settings
from app.core.database import async_engine


async def cmd_seed(confirm: bool) -> int:
    """Seed the database with demo data."""
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"Database: {settings.db_connection_string.split('://')[0]}")

    # Safety check for production
    if settings.is_production and not confirm:
        print("\n⚠️  PRODUCTION WARNING:")
        print("   This will clear all existing data and seed with demo content.")
        print("   Run with --confirm to proceed.")
        return 1

    print("\nSeeding database...")
    try:
        # Import seed module to run it
        from seed import seed_main
        await seed_main()
        print("✅ Seed completed successfully.")
        return 0
    except Exception as e:
        print(f"❌ Seed failed: {e}")
        return 1


async def cmd_health() -> int:
    """Check database connection and schema."""
    print(f"Database: {settings.db_connection_string.split('://')[0]}")

    try:
        # Simple connection test with echo
        async with async_engine.begin() as conn:
            await conn.run_sync(lambda meta, conn: None)
        print("✅ Database connection: OK")
        return 0
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return 1


def main() -> int:
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(description="Backend CLI tools")
    subparsers = parser.add_subparsers(dest="command")

    # seed command
    seed_parser = subparsers.add_parser("seed", help="Seed database with demo data")
    seed_parser.add_argument("--confirm", action="store_true", help="Skip confirmation prompt in production")

    # health command
    subparsers.add_parser("health", help="Check database connection")

    args = parser.parse_args()

    if args.command == "seed":
        return asyncio.run(cmd_seed(args.confirm))
    elif args.command == "health":
        return asyncio.run(cmd_health())
    else:
        parser.print_help()
        return 0


if __name__ == "__main__":
    sys.exit(main())