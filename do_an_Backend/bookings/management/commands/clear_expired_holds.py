from django.core.management.base import BaseCommand
from django.utils import timezone
from bookings.models import SeatHold


class Command(BaseCommand):

    help = 'Xóa ghế giữ đã hết hạn'

    def handle(self, *args, **kwargs):

        expired_holds = SeatHold.objects.filter(
            expires_at__lt=timezone.now()
        )

        count = expired_holds.count()

        expired_holds.delete()

        self.stdout.write(
            self.style.SUCCESS(
                f'Đã xóa {count} ghế giữ hết hạn'
            )
        )